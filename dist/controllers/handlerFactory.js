"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentCount = void 0;
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const appError_1 = require("./../utils/appError");
const apiFeatures_1 = __importStar(require("./../utils/apiFeatures"));
// export const memoryCache = caching('memory', { max: 100, ttl: 600, shouldCloneBeforeSet: false });
const i18n = require("../i18n/i18n.config");
const factory = {
    deleteOne: (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const doc = yield Model.findOneAndDelete({ _id: req.params.id }).lean({
            getters: true,
        });
        if (!doc) {
            return next(new appError_1.AppError(i18n.__("noDocumentFound"), 404));
        }
        return res.status(200).jsend.success({
            data: doc,
        });
    })),
    // updateOne function takes model and key as parameters
    updateOne: (Model, key) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // model parameters performe findOneAndUpdate operation
        const doc = yield Model.findOneAndUpdate({ _id: req.params.id }, Object.assign(Object.assign({}, req.body), (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) &&
            !req.body.updatedBy && {
            updatedBy: {
                id: req.user.id,
                name: `${(_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.lastName}`,
            },
        })), {
            new: true,
            runValidators: true,
            // upsert: true,
        }).lean({ getters: true });
        // if the MongoDB query did not find a matching document) will return error
        if (!doc) {
            return next(new appError_1.AppError(i18n.__("noDocumentFound"), 404));
        }
        // response
        res.status(200).jsend.success({
            status: "success",
            data: doc,
        });
    })),
    createOne: (Model) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const doc = yield Model.create(Object.assign(Object.assign({}, req.body), (((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.id) && !req.body.createdBy && { createdBy: req.user.id })));
        res.status(201).jsend.success({
            data: doc,
        });
    })),
    createMany: (Model) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        yield Model.insertMany(Object.assign(Object.assign({}, req.body), (((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.id) && !req.body.createdBy && { createdBy: req.user.id })));
        res.status(201).jsend.success({
            message: i18n.__("dataInserted"),
        });
    })),
    getOne: (Model, popOptions, caching) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        let id = (_f = req.params.id) !== null && _f !== void 0 ? _f : null;
        let doc = yield (0, apiFeatures_1.manageCache)(Model, popOptions, id, caching, req.query.fields);
        if (!doc) {
            return next(new appError_1.AppError(i18n.__("noDocumentFound"), 404));
        }
        res.status(200).jsend.success({
            data: doc,
        });
    })),
    getAll: (Model, key, popOptions, filterFunction, isQueryStrRegex) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // To allow for nested GET reviews on tour (hack)
        let filter = {};
        // if (req.params[key] && key) {filter = { [key]: req.params[key] }}
        if (req.params.id && key)
            filter = { [key]: req.params.id };
        const features = new apiFeatures_1.default(Model.find(filter).lean({ getters: true }), req.query)
            .filter(isQueryStrRegex ? true : false)
            .sort()
            .limitFields()
            .paginate()
            .search();
        // const doc = await features.query.explain();
        let docs = popOptions
            ? yield features.query.populate(popOptions)
            : yield features.query;
        if (features.query._conditions.$or) {
            req.query.$or = features.query._conditions.$or;
        }
        if (filterFunction) {
            docs = filterFunction(docs, req);
        }
        const page = Number(features.queryString.page) || 1;
        const limit = Number(features.queryString.limit) || Number.MAX_SAFE_INTEGER;
        const query1 = (0, apiFeatures_1.getRequiredQuery)(req.query);
        req.query = Object.assign(Object.assign({}, req.query), query1);
        const count = yield Model.countDocuments(req.query);
        // const count = new RegExp(/\b(gte|gt|lte|lt)\b/g).test(JSON.stringify(req.query)) ? docs.length :await Model.countDocuments(req.query) ;
        // SEND RESPONSE
        res.status(200).jsend.success({
            results: docs.length,
            data: docs,
            pages: Math.ceil(count / limit),
            currentPage: page,
        });
    })),
    countDocument: (Model) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield (0, exports.documentCount)(Model, req.query);
        // SEND RESPONSE
        res.status(200).jsend.success({
            count,
        });
    })),
    getDistinct: (Model) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _g = req.query, { distinct } = _g, rest = __rest(_g, ["distinct"]);
        const data = yield Model.find(rest).distinct(distinct);
        res.status(200).jsend.success({
            data,
        });
    })),
};
exports.default = factory;
const documentCount = (Model, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Model.countDocuments(query);
});
exports.documentCount = documentCount;
