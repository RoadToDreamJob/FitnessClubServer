const {validationResult} = require('express-validator')
const ErrorHandler = require("../error/errorHandler");
const {User} = require("../models/models");
const SecondaryFunctions = require("../validation/validation");
const bcrypt = require("bcrypt");

class UserController {

    async login(req, res, next) {
        const {userEmail, userPassword} = req.body

        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest(errors.array()))
            }

            const user = await User.findOne({where: {userEmail}})
            if (!user) {
                return next(ErrorHandler.conflict("Пользователя с такой почтой не найдено в системе!"))
            }
            const checkHashPassword = await bcrypt.compareSync(userPassword, user.userPassword)
            if (!checkHashPassword) {
                return next(ErrorHandler.conflict("Указан неверный пароль!"))
            }

            const token = SecondaryFunctions.generateJwt({
                id: user.id,
                email: user.userEmail,
                role: user.userRole
            })

            return res.json({token})
        } catch (err) {
            return next(ErrorHandler.internal(`Possible errors encountered while executing the function: ${err.message}`))
        }

    }
}

module.exports = new UserController()