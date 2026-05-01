const {STATUS_CODES}  = require("../utils/status-codes")
const {STATUS, RESPONSE_MESSAGES}  = require("../utils/status");
const { tryCatch } = require("../middlewares/try-catch");
const productService = require("../service/product");
const variantService = require("../service/variant");
const {formatResponse} = require("../utils/format-response");

const cartServices = require("../service/cart");
const { models } = require("../config/db");

const userService = require("../service/user");
const { Op } = require("sequelize");

exports.createCartForUser = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const items = req.body; // now expecting an array of items
    console.log("Items to be processed:", items);

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(STATUS_CODES.BAD_REQUEST.code).send(
            formatResponse(STATUS.FAILED, "Request body must be a non-empty array of cart items")
        );
    }


    // ✅ Validation now handled by middleware

    const results = [];

    for (const i of items) {
        const { productId, variantId, quantity } = i;

        console.log("Processing item:", variantId);
        // attach userId
        const item = { ...i, userId };

        // Fetch product
        const productFieldsToBeIncluded = ["id", "stock"];
        const productFound = await productService.fetchProductById(productId, productFieldsToBeIncluded);

        if (!productFound) {
            results.push({ productId, status: "FAILED", reason: ERROR_MESSAGES.PRODUCTS.NOT_FOUND });
            continue;
        }

        // Fetch variant if applicable
        let variantFound;
        if (variantId) {
            variantFound = await variantService.fetchVariantById(variantId, productFieldsToBeIncluded);
            if (!variantFound) {
                results.push({ productId, variantId, status: "FAILED", reason: ERROR_MESSAGES.VARIANTS.NOT_FOUND });
                continue;
            }
        }

        console.log("Variant found:", variantFound);

        const stock = variantFound ? variantFound.stock : productFound.stock;
        if (stock < quantity) {
            results.push({ productId, variantId, status: "FAILED", reason: ERROR_MESSAGES.CART.STOCK_EXCEEDS });
            continue;
        }

        // Check if already in cart
        const cartWhere = { userId, productId, variantId };
        const cartItemFound = await cartServices.fetchSingleCart(cartWhere, ["id", "quantity"]);

        if (cartItemFound) {
            // Replace quantity (not increment)
            cartItemFound.quantity = quantity;
            await cartItemFound.save();
            results.push({ productId, variantId, status: "UPDATED" });
        } else {
            await cartServices.createCart(item);
            results.push({ productId, variantId, status: "CREATED" });
        }
    }

    return res.status(STATUS_CODES.OK.code).send(
        formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CART.CREATED, results)
    );
});




exports.fetchAllCartOfAUser = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const cartWhere = { userId: userId };
    const modelsToBeIncluded = [
        {
            model: models.product,
            attributes: ["id", "title", 'comparePrice', 'salePrice', "slug", "thumbnail", "stock", "thumbnailFile"],
          
        },

        {
            model: models.variant,
            attributes: ['comparePrice', 'salePrice', "stock", "id" , "size"],
      
        }
    ]
    const cartFieldsToBeIncluded = ["id", "createdAt", "quantity", "productId", "variantId"]
    const carts = await cartServices.fetchAllCarts(cartWhere, cartFieldsToBeIncluded, modelsToBeIncluded);
    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CART.FETCHED, carts));

})


exports.deleteUserCart = tryCatch(async (req, res) => {
    const userId = req.user.id;

    const cartWhere = { userId: userId , id : req.params.cartId};
    const fielde = ["id"]
    const carts = await cartServices.fetchSingleCart(cartWhere, fielde);
    if(!carts){
        return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, "Cart item not found"))
    }
    await carts.destroy();
    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CART.DELETED))
})

exports.clearUserWholeCart = tryCatch(async (req, res) => {
    const userId = req.user.id;

    const cartWhere = { userId: userId };
    const carts = await cartServices.deleteCarts(cartWhere);

    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.CART.DELETED))
})


exports.getAllUsers = tryCatch(async (req, res) => {
    const {page , limit , search} = req.query;
    let where = {};
    if(search){
         where = {
            [Op.or]: [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ]
        };

    }
    const fields = ["id" , "firstName" , "lastName" , "email" , "createdAt" , "phoneNumber"];
    const users = await userService.fetchAllUsers(parseInt(page), parseInt(limit), where, fields);
    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.USER.FETCHED, users));
})