const { models } = require("../config/db");
const { Op } = require("sequelize");

const Product = models.product;

exports.createProduct = async (data ) => {
    return await Product.create(data );
}



exports.fetchProductById = async (id, fieldsToBeIncluded = ["id"], modelsToBeInclude = []) => {
    return await Product.findByPk(id, {
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude
    });
}

exports.fetchProductBySlug = async (slug, excludeId) => {
    const where = { slug };
    if (excludeId) {
        where.id = { [Op.ne]: excludeId };
    }
    return await Product.findOne({ where });
}

exports.updateProduct = async (product, data, options = {}) => {
    return await product.update(data, options);
}

exports.fetchAllProduct = async (page = 1, limit = 10, where = {}, fieldsToBeIncluded = ["id"], order = [["id", "desc"]], modelsToBeInclude = []) => {
    const offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,
        order: order,
        distinct: true,
        offset,
        limit,

    });


    return {
        totalItems: products.count,
        totalPages: Math.ceil(products.count / limit),
        currentPage: parseInt(page),
        products: products.rows,
    };
}




exports.fetchSingleProduct = async (where = {}, fieldsToBeIncluded = ["id"], modelsToBeInclude = []) => {
    return await Product.findOne({
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,

    });
}



exports.countProducts = async (where = {}) => {
    return await Product.count({
        where: where,
    });
}