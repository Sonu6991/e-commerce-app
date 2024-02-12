import catchAsync from "./../utils/catchAsync";
import { AppError } from "./../utils/appError";
import APIFeatures, {
  getRequiredQuery,
  manageCache,
} from "./../utils/apiFeatures";
import { NextFunction } from "express";
import _ from "lodash";

// export const memoryCache = caching('memory', { max: 100, ttl: 600, shouldCloneBeforeSet: false });
const i18n = require("../i18n/i18n.config");

const factory = {
  deleteOne: (Model: any) =>
    catchAsync(async (req: any, res: any, next: any) => {
      const doc = await Model.findOneAndDelete({ _id: req.params.id }).lean({
        getters: true,
      });

      if (!doc) {
        return next(new AppError(i18n.__("noDocumentFound"), 404));
      }

      return res.status(200).jsend.success({
        data: doc,
      });
    }),
  // updateOne function takes model and key as parameters
  updateOne: (Model: any, key?: string) =>
    catchAsync(async (req: any, res: any, next: NextFunction) => {
      // model parameters performe findOneAndUpdate operation
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
          ...(req?.user?.id &&
            !req.body.updatedBy && {
              updatedBy: {
                id: req.user.id,
                name: `${req?.user?.firstName} ${req?.user?.lastName}`,
              },
            }),
        },
        {
          new: true,
          runValidators: true,
          // upsert: true,
        }
      ).lean({ getters: true });
      // if the MongoDB query did not find a matching document) will return error
      if (!doc) {
        return next(new AppError(i18n.__("noDocumentFound"), 404));
      }
      // response
      res.status(200).jsend.success({
        status: "success",
        data: doc,
      });
    }),

  createOne: (Model: any) =>
    catchAsync(async (req: any, res: any) => {
      const doc = await Model.create({
        ...req.body,
        ...(req?.user?.id && !req.body.createdBy && { createdBy: req.user.id }),
      });
      res.status(201).jsend.success({
        data: doc,
      });
    }),

  createMany: (Model: any) =>
    catchAsync(async (req: any, res: any) => {
      await Model.insertMany({
        ...req.body,
        ...(req?.user?.id && !req.body.createdBy && { createdBy: req.user.id }),
      });
      res.status(201).jsend.success({
        message: i18n.__("dataInserted"),
      });
    }),

  getOne: (Model: any, popOptions?: any, caching?: any) =>
    catchAsync(async (req: any, res: any, next: NextFunction) => {
      let id = req.params.id ?? null;
      let doc = await manageCache(
        Model,
        popOptions,
        id,
        caching,
        req.query.fields
      );
      if (!doc) {
        return next(new AppError(i18n.__("noDocumentFound"), 404));
      }
      res.status(200).jsend.success({
        data: doc,
      });
    }),

  getAll: (
    Model: any,
    key?: any,
    popOptions?: any,
    filterFunction?: any,
    isQueryStrRegex?: boolean
  ) =>
    catchAsync(async (req: any, res: any) => {
      // To allow for nested GET reviews on tour (hack)
      let filter: any = {};
      // if (req.params[key] && key) {filter = { [key]: req.params[key] }}
      if (req.params.id && key) filter = { [key]: req.params.id };
      const features = new APIFeatures(
        Model.find(filter).lean({ getters: true }),
        req.query
      )
        .filter(isQueryStrRegex ? true : false)
        .sort()
        .limitFields()
        .paginate()
        .search();
      // const doc = await features.query.explain();
      let docs = popOptions
        ? await features.query.populate(popOptions)
        : await features.query;
      if (features.query._conditions.$or) {
        req.query.$or = features.query._conditions.$or;
      }

      if (filterFunction) {
        docs = filterFunction(docs, req);
      }

      const page = Number(features.queryString.page) || 1;
      const limit =
        Number(features.queryString.limit) || Number.MAX_SAFE_INTEGER;
      const query1 = getRequiredQuery(req.query);
      req.query = { ...req.query, ...query1 };
      const count = await Model.countDocuments(req.query);
      // const count = new RegExp(/\b(gte|gt|lte|lt)\b/g).test(JSON.stringify(req.query)) ? docs.length :await Model.countDocuments(req.query) ;
      // SEND RESPONSE
      res.status(200).jsend.success({
        results: docs.length,
        data: docs,
        pages: Math.ceil(count / limit),
        currentPage: page,
      });
    }),

  countDocument: (Model: any) =>
    catchAsync(async (req: any, res: any) => {
      const count = await documentCount(Model, req.query);
      // SEND RESPONSE
      res.status(200).jsend.success({
        count,
      });
    }),

  getDistinct: (Model: any) =>
    catchAsync(async (req: any, res: any) => {
      const { distinct, ...rest } = req.query;

      const data = await Model.find(rest).distinct(distinct);
      res.status(200).jsend.success({
        data,
      });
    }),
};

export default factory;

export const documentCount = async (Model: any, query?: any) => {
  return await Model.countDocuments(query);
};
