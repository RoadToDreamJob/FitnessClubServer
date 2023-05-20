const ErrorHandler = require("../error/errorHandler");
const {validationResult} = require("express-validator");
const {User, Client, Training, Abonement, AbonementTrainings} = require("../models/models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");

class AdminController {

    //region Раздел с клиентами

    async createUser(req, res, next) {
        const {
            userEmail,
            userPassword,
            userRole,
            clientFio,
            clientPhone,
            clientSex,
            clientBirthday
        } = req.body

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()))
            }

            if (await User.findOne({where: {userEmail}})) {
                return next(ErrorHandler.conflict('Данная почта уже существует в системе!'))
            }
            const hashPassword = await bcrypt.hash(userPassword, 5)
            const user = await User.create({
                userEmail: userEmail,
                userPassword: hashPassword,
                userRole
            })

            if (await Client.findOne({clientPhone})) {
                return next(ErrorHandler.conflict('Данный номер уже существует в системе!'))
            }

            const client = await Client.create({
                clientFio,
                clientPhone,
                clientSex,
                clientBirthday,
                userId: user.id
            })

            return res.json(client)
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async getAllUser(req, res, next) {
        const {} = req.body
    }

    //endregion

    //region Раздел с абонементами

    async createAbonement(req, res, next) {
        const {
            trainingCount,
            abonementTitle,
            abonementDescription,
            abonementPrice,
            trainingId
        } = req.body

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()))
            }

            if (await Abonement.findOne({where: {abonementTitle}})) {
                return next(ErrorHandler.conflict('Данное название абонемента уже существует в системе!'))
            }

            const abonement = await Abonement.create({
                trainingCount,
                abonementTitle,
                abonementDescription,
                abonementPrice
            })
            let trainingAbonement = []
            for (let training of trainingId) {
                const trainings = await Training.findOne({where: {id: training}})
                if (!trainings) {
                    return next(ErrorHandler.badRequest(`Тренировски с номером ${training} не найдено!`))
                }
                trainingAbonement.push({
                    abonementId: abonement.id,
                    trainingId: training
                })
            }
            await AbonementTrainings.bulkCreate(trainingAbonement)
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async updateAbonemet(req, res, next) {
        const {
            id,
            trainingCount,
            abonementTitle,
            abonementDescription,
            abonementPrice,
            trainingId
        } = req.body

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()));
            }

            const candidate = await Abonement.findOne({where: {id}})
            if (!candidate) {
                return next(ErrorHandler.badRequest('Данного абонемента нет в системе!'))
            }

            if ((abonementTitle !== candidate.abonementTitle) && await Abonement.findOne({where: {abonementTitle}})) {
                return next(ErrorHandler.conflict('Данное название абонемента уже существует в системе!'))
            }

            const abonement = candidate.update({
                trainingCount,
                abonementTitle,
                abonementDescription,
                abonementPrice
            })

            if (trainingId) {
                for (const training of trainingId) {
                    const trainings = await Training.findOne({where: {id: training}})
                    if (!trainings) {
                        return next(ErrorHandler.badRequest(`Тренировки с идентификатором ${training} не найдено в системе!`))
                    }

                    await AbonementTrainings.update(
                        {trainingId},
                        {
                            where: {
                                abonementId: id,
                                trainingId: trainings.id
                            }
                        }
                    );
                }
            }
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async deleteAbonemet(req, res, next) {
        const {id} = req.body

        try {

        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    //endregion

    //region Раздел с тренировками

    async createTraining(req, res, next) {
        const {
            trainingName,
            trainingDescription
        } = req.body
        const {trainingImage} = req.files

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()))
            }

            if (await Training.findOne({where: {trainingName}})) {
                return next(ErrorHandler.conflict('Данная тренировка уже существует в системе!'))
            }

            let fileName = uuid.v4() + ".jpg"
            await trainingImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const training = await Training.create({
                trainingName,
                trainingDescription,
                trainingImage: fileName
            })

            return res.json(training)
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async getAllTraining(req, res, next) {
        try {
            const training = await Training.findAll({
                order: [['id', 'asc']]
            })
            return res.json(training)
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async updateTraining(req, res, next) {
        const {
            id,
            trainingName,
            trainingDescription,
        } = req.body
        const {trainingImage} = req.files

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()))
            }

            const candidate = await Training.findOne({where: {id}})
            if (!candidate) {
                return next(ErrorHandler.badRequest('Данной тренировки в нашей системе нет!'))
            }

            if ((trainingName !== candidate.trainingName) && await Training.findOne({where: {trainingName}})) {
                return next(ErrorHandler.conflict('Такая тренировка уже существует в нашей системе!'))
            }

            let fileName = uuid.v4() + ".jpg"
            await trainingImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const training = await candidate.update({
                trainingName,
                trainingDescription,
                trainingImage: fileName
            })

            return res.json(training)
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    async deleteTraining(req, res, next) {
        const {id} = req.body

        try {
            await Training.findOne({where: {id}})
                .then(async (training) => {
                    if (!training) {
                        return next(ErrorHandler.badRequest('Данной тренировки в нашей системе нет!'))
                    }

                    await training.destroy();
                    res.status(200).json({message: 'Данная тренировка успешно удалена!'})
                })
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }
    }

    //endregion

}

module.exports = new AdminController()