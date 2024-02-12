"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageCache = exports.getRequiredQuery = void 0;
const lodash_1 = __importDefault(require("lodash"));
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter(isQueryStrRegex) {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|eq)\b/g, (match) => `$${match}`);
        if (isQueryStrRegex) {
            const JSON_Obj = JSON.parse(queryStr);
            let json = {};
            for (var key in JSON_Obj) {
                // if (key === 'gender') {
                json[`${key}`] = JSON_Obj[key];
                // } else {
                //   json[`${key}`] = { $regex: JSON_Obj[key], $options: 'i' };
                // }
            }
            this.query = this.query.find(json).lean({ getters: true });
        }
        else {
            this.query = this.query
                .find(JSON.parse(queryStr))
                .lean({ getters: true });
        }
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || Number.MAX_SAFE_INTEGER;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    search() {
        let searchQuery = [];
        if (this.queryString.search && this.queryString.searchFields) {
            const regex = this.queryString.search;
            lodash_1.default.forEach(JSON.parse(this.queryString.searchFields), (item) => {
                searchQuery.push({ [item]: regex });
            });
            this.query = this.query.find({ $or: searchQuery });
        }
        return this;
    }
}
const getRequiredQuery = (queryObj) => {
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const JSON_Obj = JSON.parse(queryStr);
    return JSON_Obj;
};
exports.getRequiredQuery = getRequiredQuery;
const manageCache = (Model, popOptions, id, caching, fields) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // let query: any = (await (await memoryCache).get(caching?.key)) ?? null;
    let query = null;
    if (id && ((_a = query === null || query === void 0 ? void 0 : query._id) === null || _a === void 0 ? void 0 : _a.toString()) !== id) {
        query = yield Model.findById(id).lean({ getters: true });
    }
    else if (!query) {
        query = yield Model.findOne().lean({ getters: true });
    }
    if (fields) {
        query = query.select(fields.split(",").join(" "));
    }
    if (popOptions) {
        query = query.populate(popOptions);
    }
    return query;
});
exports.manageCache = manageCache;
exports.default = APIFeatures;
