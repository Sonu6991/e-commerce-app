"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = require("../utils/appError");
const i18n = require('../i18n/i18n.config');
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.AppError(message, 400);
};
const handleJWTError = () => new appError_1.AppError(i18n.__('invalidToken'), 401);
const handleJWTExpiredError = () => new appError_1.AppError(i18n.__('invalidTokenOrExpired'), 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            // error: err,
            message: err.message,
            // stack: err.stack,
        });
    }
    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    // return res.status(err.statusCode).render('error', {
    //   title: i18n.__('somethingWentWrong'),
    //   msg: err.message,
    // });
    return res.status(err.statusCode).jsend.error({ message: err.message });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).jsend.error({
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).jsend.error({
            message: i18n.__('somethingWentWrong'),
        });
    }
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        // return res.status(err.statusCode).render('error', {
        //   title: i18n.__("somethingWentWrong"),
        //   msg: err.message,
        // });
        return res.status(err.statusCode).jsend.error({ message: err.message });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    // return res.status(err.statusCode).render('error', {
    //   title: i18n.__('somethingWentWrong'),
    //   msg: i18n.__('plzTryAgain'),
    // });
    return res.status(err.statusCode).jsend.error({ message: i18n.__('plzTryAgain') });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
    else {
        res.jsend.error({ message: 'off' });
    }
};
exports.globalErrorHandler = globalErrorHandler;
