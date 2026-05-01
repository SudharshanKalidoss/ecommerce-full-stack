const router = require("express").Router();

const productController = require("../controller/product");
const validate = require("../middlewares/schema-validator");
const { productCreateSchema, productUpdateSchema } = require("../validator/product");
const { adminOnly } = require("../middlewares/authenticate");
const upload = require("../middlewares/multer");
const { authenticate } = require("../utils/jwt-helper");




//Product routes

router
  .route("/")
  .get(productController.fetchAllProduct)
  .post(
    authenticate,
    adminOnly,
    upload.single("thumbnail"),
    validate(productCreateSchema),
    productController.productCreate
  )


router
  .route("/:id")
  .get(productController.fetchProductById)
  .put(
    authenticate,
    adminOnly,
    upload.single("thumbnail"),
    validate(productUpdateSchema),
    productController.updateProduct
  )
  .delete(authenticate, adminOnly, productController.deleteProductById)


// router.route("/:id")
//     .get(authenticate,  productController.getProductById)
//     .patch(authenticate,  productController.updateProductStatus)
//     .delete(authenticate, productController.deleteProductById)
//     .put(authenticate,uploadProductImages.fields([
//         { name: "thumbnail", maxCount: 1 },

//     ]), productController.updateProduct)


module.exports = router;