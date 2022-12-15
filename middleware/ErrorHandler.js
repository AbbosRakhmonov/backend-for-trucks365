const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = {...err}

    error.message = err.message

    // Log to console for dev
    console.log(err)

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        // get the model name from the error message
        const modelName = err.message.split(' ')[3]
        const message = `Resource not found for ${modelName}`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        // get the field name
        const field = Object.keys(err.keyValue)[0]
        const message = `Duplicate field value entered: ${field}`
        error = new ErrorResponse(message, 400)
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler
