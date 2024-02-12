import _ from "lodash";
import mongoose from "mongoose";
import { AppError } from "./appError";


export const checkCollectionExists = (collectionName: string) => {
  // let value: boolean = false;'
  return new Promise(function (myResolve, myReject) {
    mongoose.connection.db
      .listCollections()
      .toArray(function (err: any, collectionNames: any) {
        if (err) {
          myReject(false);
        }
        const value = _.some(
          collectionNames,
          (val: any) => val.name === collectionName
        );
        if (value) {
          myResolve(value);
        } else {
          myReject(false);
        }
      });
  }).then(
    function (value) {
      return true;
    },
    function (error) {
      return false;
    }
  );
  // return value;
};

export const handleUnMatchedRoute = (routeList: any) => {
  return (req: any, res: any, next: any) => {
    let allURLs: Array<string> = _.flatten(Object.values(routeList));
    /** pre added for rpm  */
    const regexArr: any = [
      /^\/api\/v1\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*\/rpm?$/,
      /^\/api\/v1\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*\/rpm\/(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*?$/,
    ];
    let reqURL: string = req.originalUrl;
    if (req.originalUrl.includes("&") && !req.originalUrl.includes("?")) {
      reqURL = req.originalUrl.split("&")[0];
    } else if (req.originalUrl.includes("?")) {
      reqURL = reqURL.split("?")[0];
    }
    const letterCaseRegex =
      /(?=[^A-Za-z\n]*[A-Za-z])[A-Za-z0-9@~`!@#$%^&*()_=+\\\\';:\"\\?>.<,-]*/;
    // const letterCaseRegex = /[A-Za-z]/
    allURLs.forEach((url: any) => {
      let regexURL: any = null;
      const splitedURL = url.split("/");
      if (url !== "[Unknown path]/:id" && !url.includes("[Unknown path]")) {
        splitedURL.forEach((key: string) => {
          if (key.trim().length && key !== "[Unknown path]") {
            if (key.includes(":")) {
              if (regexURL === null) {
                regexURL = letterCaseRegex;
              } else {
                let flags = regexURL.flags + letterCaseRegex.flags;
                flags = Array.from(new Set(flags.split(""))).join();
                regexURL = new RegExp(
                  regexURL.source + "/" + letterCaseRegex.source,
                  flags
                );
              }
            } else {
              if (regexURL === null) {
                regexURL = new RegExp("^" + "/" + key);
              } else {
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
      } else {
        regexURL !== null && regexArr.push(new RegExp(regexURL.source + "?$"));
      }
    });

    let isValid = false;

    if (!isValid) {
      isValid = regexArr.some((regex: any) => {
        if (regex.test(reqURL)) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (isValid) {
      return next(new AppError(`Method Not Allowed`, 405));
    } else {
      return next(new AppError(`Can not find ${reqURL} on this server!`, 404));
    }
  };
};
