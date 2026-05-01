const { models } = require("../config/db");

const Category = models.category;



exports.fetchAllCategories = async (where = {}, fieldsToBeIncluded = ["id"], order = [["id", "desc"]], modelsToBeInclude = []) => {
    const categories = await Category.findAll({
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,
        order: order,
 

    });


    return categories;

  
}



exports.fetchCategoryById = async (id , where = {}, fieldsToBeIncluded = ["id"], order = [["id", "desc"]], modelsToBeInclude = []) => {
    const categories = await Category.findByPk(id, {
        where: where,
        attributes: fieldsToBeIncluded,
        include: modelsToBeInclude,
        order: order,
 

    });


    return categories;

  
}