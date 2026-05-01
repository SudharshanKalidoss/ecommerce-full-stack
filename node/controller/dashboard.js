const { tryCatch } = require("../middlewares/try-catch");
const productService = require("../service/product");
const userService = require("../service/user");
const { formatResponse } = require("../utils/format-response");
const { STATUS } = require("../utils/status");
const { STATUS_CODES } = require("../utils/status-codes");
const { USER_ROLES } = require("../utils/user-roles");

exports.getDashboardStats = tryCatch( async (req, res) => {
    const productCount = await productService.countProducts();

    const userWere = { role: USER_ROLES.USER }
    const userCount = await userService.countUsers(userWere);

    const data = {products : productCount , users : userCount}

    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, "Dashboard stats fetched successfully", data))

})