const jwt = require('jsonwebtoken')

/**
 * Вспомогательные функции.
 */
class SecondaryFunctions {

    //region Валидация параметров.

    /**
     * Проверять, является ли переменная "value" строкой.
     * @param value - параметр для проверки.
     * @returns {boolean} - true - строка / false - не строка.
     */
    static isString(value) {
        return ((typeof (value) === "string") ||
            (value instanceof String))
    }

    /**
     * Проверять, является ли переменная "value" пустой.
     * @param value - параметр для проверки.
     * @returns {boolean} - true - пустая / false - не пустая.
     */
    static isEmpty(value) {
        return value.trim() === ''
    }

    /**
     * Проверить, является ли объект пустым.
     * @param value - параметр для проверки.
     * @returns {boolean} - true - пустой, false - не пустой.
     */
    static isEmptyObject(value) {
        return !Object.keys(value).length
    }

    /**
     * Проверять, является ли переменная "value" числом.
     * @param value - параметр для проверки.
     * @returns {boolean} - true - число / false - не число.
     */
    static isNumber(value) {
        return (!isNaN(value))
    }

    /**
     * Проверять, является ли переменная "timeValue" временем.
     * @param timeValue - параметр для проверки времени.
     * @returns {boolean} - true - время / false - не время.
     */
    static isTime(timeValue) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(timeValue);
    }


    //endregion

    //region Генерация токенов доступа к аккаунту.

    /**
     * Генерация JWT-токена.
     * @param id - Идентификатор.
     * @param email - Почта пользователя.
     * @param role - Роль пользователя.
     * @returns {*} - jwt-токен.
     */
    static generateJwt = ({ id, email, role }) => {
        const payload = { id, email, role };

        return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '24h'
            }
        );
    };

    //endregion

    //region Валидация данных пользователя.

    /**
     * Валидация телефона.
     * @param number - Телефон пользователя.
     * @returns {boolean} - true - телефон валиден / false - телефон не валиден.
     * */
    static validateNumber(number) {
        const regex = /^((\+7|7|8)+([0-9]){10})$|^((\+7|7|8)+(\s|\()([0-9]){3}(\s|\))([0-9]){3}(\s|-)?([0-9]){2}(\s|-)?([0-9]){2})$/
        return regex.test(number)
    }

    //endregion

}

module.exports = SecondaryFunctions