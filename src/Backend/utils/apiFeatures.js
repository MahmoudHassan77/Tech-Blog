class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const { limit, page, sort, fields, keyword, ...queryStringObject } =
      this.queryString;
    let qs = JSON.stringify(queryStringObject);
    qs = qs.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    qs = JSON.parse(qs);
    this.mongooseQuery = this.mongooseQuery.find(qs);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); // (-) it means => decs
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const choosenFields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(choosenFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(fields) {
    const fieldsOptArr = [];
    fields.forEach((element) => {
      const newOpt = {};
      newOpt[element] = { $regex: this.queryString.keyword, $options: "i" };
      fieldsOptArr.push(newOpt);
    });

    if (this.queryString.keyword) {
      const query = {};
      query.$or = [...fieldsOptArr];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const pageNo = +this.queryString.page || 1;
    const pageLimit = +this.queryString.limit || 10;
    const skip = (pageNo - 1) * pageLimit;
    const endIndex = pageNo * pageLimit;
    // Pagination Result
    const pagination = {};
    pagination.currentPage = pageNo;
    pagination.limit = pageLimit;
    pagination.numberOfPages = Math.ceil(countDocuments / pageLimit);
    // nextPage
    if (endIndex < countDocuments) {
      pagination.next = pageNo + 1;
    }
    // prevPage
    if (skip > 0) {
      pagination.prev = pageNo - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(pageLimit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
