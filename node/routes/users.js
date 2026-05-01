const router = require("express").Router();
const userController = require('../controller/user');
const {authenticate} = require("../utils/jwt-helper");
const validate = require("../middlewares/schema-validator");
const { cartSchema } = require("../validator/cart");

router.route("/cart")
    .get(authenticate, userController.fetchAllCartOfAUser)
    .post(authenticate, validate(cartSchema), userController.createCartForUser)

    
router.route("/cart/clear-all")
    .delete(authenticate, userController.clearUserWholeCart)
router.route("/cart/:cartId")
    .delete(authenticate, userController.deleteUserCart)




    module.exports = router;