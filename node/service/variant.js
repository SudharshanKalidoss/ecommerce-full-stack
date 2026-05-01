const { models } = require("../config/db");

const Variant = models.variant;

exports.createVariant = async (data ) => {
    return await Variant.create(data );
}

exports.bulkCreateVariants = async (data = [], options = {}) => {
    return await Variant.bulkCreate(data, options);
}

exports.fetchVariants = async (where = {}, attributes = ["id", "size", "salePrice", "comparePrice", "stock", "productId"], options = {}) => {
    return await Variant.findAll({ where, attributes, ...options });
}

exports.updateVariant = async (id, data, options = {}) => {
    const variant = await Variant.findByPk(id, options);
    if (!variant) return null;
    return await variant.update(data, options);
}

exports.deleteVariants = async (where, options = {}) => {
    return await Variant.destroy({ where, ...options });
}

exports.fetchVariantById = async (id, fieldsToBeIncluded = ["id"], modelsToBeInclude = []) => {
    return await Variant.findByPk(id, {
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude
    });
}




exports.fetchSingleVariant = async (where = {}, fieldsToBeIncluded = ["id"], modelsToBeInclude = []) => {
    return await Variant.findOne({
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,

    });
}

