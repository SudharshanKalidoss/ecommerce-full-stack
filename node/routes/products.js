router = require("express").Router();
const productController = require("../controller/product");



router.route("/")
    .get(productController.fetchAllProductForGride)

router.route("/:slug")
    .get(productController.fetchProductBySlug)

module.exports = router;
