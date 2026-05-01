const { models } = require("../config/db");

const User = models.users;

exports.fetchSingleUserByWhere = async (where, fieldsToBeIncluded = ["id"], order = [["id", "DESC"]]) => {
    return await User.findOne({
        where: where,
        attributes: fieldsToBeIncluded,
        order: order,
    });
}

exports.createUsers = async (data) => {
  return await User.create(data);
};


exports.countUsers = async (where = {}) => {
    return await User.count({
        where: where,
    });
}



exports.fetchAllUsers = async (page = 1, limit = 10, where = {}, fieldsToBeIncluded = ["id"], order = [["id", "desc"]], modelsToBeInclude = []) => {
    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,
        order: order,
        distinct: true,
        offset,
        limit,

    });


    return {
        totalItems: users.count,
        totalPages: Math.ceil(users.count / limit),
        currentPage: parseInt(page),
        users: users.rows,
    };
}
