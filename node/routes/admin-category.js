
const router = require("express").Router();
const categoryController = require('../controller/categories');
const { adminOnly } = require("../middlewares/authenticate");

const {authenticate} = require("../utils/jwt-helper");


router.get("/",authenticate , adminOnly ,  categoryController.fetchAllCategories);
router.get("/:id",authenticate , adminOnly,  categoryController.fetchCategoryById);

module.exports = router;


