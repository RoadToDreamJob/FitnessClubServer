const ErrorHandler = require('../error/errorHandler')

module.exports = function (error,
                           req,
                           res,
                           next) {

    if (error instanceof ErrorHandler) {
        return res.status(error.status).json({message: error.message})
    }
    return res.status(500).json({message: "Непредвиденная ошибка. Статус: 500."})

}