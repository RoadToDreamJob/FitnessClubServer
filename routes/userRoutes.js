const Router = require('express')
const router = new Router()

const UserController = require('../controller/userController')
const {body} = require("express-validator");

router.post('/login',[
    body("userEmail")
        .exists()
        .isEmail()
        .withMessage('Пожалуйста, введите корректную почту!'),
    body("userPassword")
        .exists()
        .isLength({min: 6, max: 12})
        .withMessage('Пароль должен сожержать минимум 6 символов,максимум 12!')
], UserController.login);
module.exports = router