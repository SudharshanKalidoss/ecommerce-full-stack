const { models } = require("../config/db")

const Cart = models.cart


exports.fetchAllCarts = async(where ={} , fieldsToBeIncluded= ['id'] , modelsToBeIncluded = [] , order = [["id" ,"DESC"]])=>{
    return await Cart.findAll({
        where : where,
        attributes : fieldsToBeIncluded,
        include: modelsToBeIncluded,
        order : order
    })
}

exports.fetchSingleCart = async(where ={} , fieldsToBeIncluded= ['id'] , modelsToBeIncluded = [] , order = [["id" ,"DESC"]])=>{
    return await Cart.findOne({
        where : where,
        attributes : fieldsToBeIncluded,
        include: modelsToBeIncluded,
    
    })
}

exports.createCart = async(data) =>{
    return await Cart.create(data);
}

exports.deleteCarts = async (where) => {
    return await Cart.destroy({ where });
};