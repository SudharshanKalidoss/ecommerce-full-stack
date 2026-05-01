const { tryCatch } = require("../middlewares/try-catch");
const categoryService = require("../service/categories");
const { formatResponse } = require("../utils/format-response");
const { STATUS, RESPONSE_MESSAGES } = require("../utils/status");
const { STATUS_CODES } = require("../utils/status-codes");

exports.fetchAllCategories = tryCatch(async (req, res) => {

  const where = {};

  let fieldsToBeIncluded = ["id", "name"]

  const categories = await categoryService.fetchAllCategories(where, fieldsToBeIncluded);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CATEGORIES.FETCHED, categories))
})




exports.fetchCategoryById = tryCatch(async (req, res) => {

  const id = req.params.id;
  const where = {};

  let fieldsToBeIncluded = ["id", "name"]

  const categories = await categoryService.fetchCategoryById(id, where, fieldsToBeIncluded);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CATEGORIES.FETCHED, categories))
})




