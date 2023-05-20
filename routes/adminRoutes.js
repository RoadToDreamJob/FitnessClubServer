const Router = require('express')
const router = new Router()

const AdminController = require('../controller/adminController')
const {body} = require("express-validator");

//region Клиенты
router.post('/createUser', [
    body("userEmail")
        .exists()
        .isString()
        .isEmail()
        .withMessage('Пожалуйста, введите корректную почту!'),
    body("userPassword")
        .exists()
        .isLength({min: 6, max: 12})
        .withMessage('Пароль должен сожержать минимум 6 символов,максимум 12!'),
    body("clientFio")
        .exists()
        .isString()
        .custom((value, {req}) => {
            const words = value.split(" ")
            return words.length === 2 || words.length === 3
        })
        .withMessage("Пожалуйста, введите корректное ФИО!"),
    body("clientPhone")
        .exists()
        .isString()
        .isMobilePhone("ru-RU")
        .withMessage('Пожалуйста, введите корректный номер!'),
    body("clientSex")
        .exists()
        .isString()
        .isIn(["Мужской", "Женский"])
        .withMessage('Пожалуйста, выберите корректный пол!'),
    body("clientBirthday")
        .exists()
        .isDate()
        .withMessage('Пожалуйста, выьерите корректную дату рождения!')
        .custom((value) => {
            const birthdate = new Date(value);
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            return birthdate <= eighteenYearsAgo;
        })
        .withMessage('Клиенту должно быть больше 18 лет!')
], AdminController.createUser);
//endregion

//region Тренеры
//endregion

//region Абонементы

router.post('/createAbonement', [
    body("trainingCount")
        .exists()
        .withMessage('Пожалуйста, введите корректное количество тренировок для абонемента!')
        .isInt({gte: 1})
        .withMessage('Минимальное количество тренировок должно быть больше или равно 1!'),
    body("abonementTitle")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное название абонемента!'),
    body("abonementDescription")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное описание абонемента!'),
    body("abonementPrice")
        .exists()
        .withMessage('Пожалуйста, введите корректную цену абонемента!')
        .isInt({gte: 500})
        .withMessage('Минимальная цена абонемента в нашем клубе 500 рублей!'),
    body("trainingId")
        .exists()
        .isArray({min: 1})
        .withMessage('Пожалуйста, выберите хотя бы одну услугу!')
], AdminController.createAbonement)

//endregion

//region Тренировки

router.post('/createTraining', [
    body("trainingName")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное название тренировки!'),
    body("trainingDescription")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное описание тренировки!')
], AdminController.createTraining)

router.get('/getTraining', AdminController.getAllTraining)

router.put('/updateTraining', [
    body("id")
        .exists()
        .isNumeric()
        .withMessage('Пожалуйста, выберите корректный идентификатор тренировки!'),
    body("trainingName")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное название тренировки!'),
    body("trainingDescription")
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Пожалуйста, введите корректное описание тренировки!')
], AdminController.updateTraining)

router.delete('/deleteTraining', [
    body("id")
        .exists()
        .isNumeric()
        .withMessage('Пожалуйста, выберите корректный идентификатор тренировки!')
], AdminController.deleteTraining)

//endregion

module.exports = router