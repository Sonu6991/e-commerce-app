import _ from "lodash";

class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(isQueryStrRegex?: boolean) {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|eq)\b/g,
      (match) => `$${match}`
    );
    if (isQueryStrRegex) {
      const JSON_Obj = JSON.parse(queryStr);
      let json: any = {};
      for (var key in JSON_Obj) {
        // if (key === 'gender') {
        json[`${key}`] = JSON_Obj[key];
        // } else {
        //   json[`${key}`] = { $regex: JSON_Obj[key], $options: 'i' };
        // }
      }
      this.query = this.query.find(json).lean({ getters: true });
    } else {
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
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
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
    let searchQuery: any = [];
    if (this.queryString.search && this.queryString.searchFields) {
      const regex = this.queryString.search;
      _.forEach(JSON.parse(this.queryString.searchFields), (item) => {
        searchQuery.push({ [item]: regex });
      });
      this.query = this.query.find({ $or: searchQuery });
    }

    return this;
  }
}

export const getRequiredQuery = (queryObj: any) => {
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const JSON_Obj = JSON.parse(queryStr);
  return JSON_Obj;
};

export const manageCache = async (
  Model: any,
  popOptions?: any,
  id?: any,
  caching?: any,
  fields?: any
) => {
  // let query: any = (await (await memoryCache).get(caching?.key)) ?? null;
  let query: any = null;

  if (id && query?._id?.toString() !== id) {
    query = await Model.findById(id).lean({ getters: true });
  } else if (!query) {
    query = await Model.findOne().lean({ getters: true });
  }
  if (fields) {
    query = query.select(fields.split(",").join(" "));
  }
  if (popOptions) {
    query = query.populate(popOptions);
  }

  return query;
};
export default APIFeatures;
