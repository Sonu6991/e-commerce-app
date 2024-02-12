import { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/appError';
const i18n = require('../i18n/i18n.config');

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError(i18n.__('invalidToken'), 401);

const handleJWTExpiredError = () => new AppError(i18n.__('invalidTokenOrExpired'), 401);

const sendErrorDev = (err: any, req: Request, res: any) => {
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

const sendErrorProd = (err: any, req: Request, res: Response) => {
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

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  } else {
    res.jsend.error({ message: 'off' });
  }
};
