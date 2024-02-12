"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnMatchedRoute = exports.checkCollectionExists = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = require("./appError");
const checkCollectionExists = (collectionName) => {
    // let value: boolean = false;'
    return new Promise(function (myResolve, myReject) {
        mongoose_1.default.connection.db
            .listCollections()
            .toArray(function (err, collectionNames) {
            if (err) {
                myReject(false);
            }
            const value = lodash_1.default.some(collectionNames, (val) => val.name === collectionName);
            if (value) {
                myResolve(value);
            }
            else {
                myReject(false);
            }
        });
    }).then(function (value) {
        return true;
    }, function (error) {
        return false;
    });
    // return value;
};
exports.checkCollectionExists = checkCollectionExists;
const handleUnMatchedRoute = (routeList) => {
    return (req, res, next) => {
        let allURLs = lodash_1.default.flatten(Object.values(routeList));
        /** pre added for rpm  */
        const regexArr = [
            /^\/api\/v1\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*\/rpm?$/,
            /^\/api\/v1\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*\/rpm\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*?$/,
        ];
        let reqURL = req.originalUrl;
        if (req.originalUrl.includes("&") && !req.originalUrl.includes("?")) {
            reqURL = req.originalUrl.split("&")[0];
        }
        else if (req.originalUrl.includes("?")) {
            reqURL = reqURL.split("?")[0];
        }
        const letterCaseRegex = /(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*/;
        // const letterCaseRegex = /[A-Za-z]/
        allURLs.forEach((url) => {
            let regexURL = null;
            const splitedURL = url.split("/");
            if (url !== "[Unknown path]/:id" && !url.includes("[Unknown path]")) {
                splitedURL.forEach((key) => {
                    if (key.trim().length && key !== "[Unknown path]") {
                        if (key.includes(":")) {
                            if (regexURL === null) {
                                regexURL = letterCaseRegex;
                            }
                            else {
                                let flags = regexURL.flags + letterCaseRegex.flags;
                                flags = Array.from(new Set(flags.split(""))).join();
                                regexURL = new RegExp(regexURL.source + "/" + letterCaseRegex.source, flags);
                            }
                        }
                        else {
                            if (regexURL === null) {
                                regexURL = new RegExp("^" + "/" + key);
                            }
                            else {
                                let flags = regexURL.flags;
                                flags = Array.from(new Set(flags.split(""))).join();
                                regexURL = new RegExp(regexURL.source + "/" + key, flags);
                            }
                        }
                    }
                });
            }
            if (reqURL.slice(-1) === "/") {
                regexURL !== null &&
                    regexArr.push(new RegExp(regexURL.source + "/" + "?$"));
            }
            else {
                regexURL !== null && regexArr.push(new RegExp(regexURL.source + "?$"));
            }
        });
        let isValid = false;
        if (!isValid) {
            isValid = regexArr.some((regex) => {
                if (regex.test(reqURL)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        if (isValid) {
            return next(new appError_1.AppError(`Method Not Allowed`, 405));
        }
        else {
            return next(new appError_1.AppError(`Can not find ${reqURL} on this server!`, 404));
        }
    };
};
exports.handleUnMatchedRoute = handleUnMatchedRoute;
