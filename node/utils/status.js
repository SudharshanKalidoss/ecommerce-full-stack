const { USE } = require("sequelize/lib/index-hints")

exports.STATUS = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED"
}

exports.RESPONSE_MESSAGES = {

    AUTH: {
        LOGGEDIN: "Logged in successfully",

    },

    PRODUCTS: {
        FETCHED: "Products fetched successfully",
        CREATED: "Products created successfully",
        UPDATED: "Products updated successfully",
        DELETED: "Products deleted successfully"
    },
        CATEGORIES: {
        FETCHED: "Categories fetched successfully",
        CREATED: "Categories created successfully",
        UPDATED: "Categories updated successfully",
        DELETED: "Categories deleted successfully"
    },
    
    CART: {
        CREATED: "Cart created/updated successfully",
        FETCHED: "Cart fetched successfully",
        DELETED: "Cart deleted successfully",
        STOCK_EXCEEDS: "Requested quantity exceeds available stock"
    },
    USER : {
        FETCHED: "Users fetched successfully",
    }
}
