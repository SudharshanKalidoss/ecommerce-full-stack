
const router = require("express").Router();
const categoryController = require('../controller/categories');



router.get("/", categoryController.fetchAllCategories);
router.get("/:id", categoryController.fetchCategoryById);

module.exports = router;


