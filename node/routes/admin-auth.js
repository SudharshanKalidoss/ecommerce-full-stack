const router = require("express").Router();
const authController = require("../controller/auth");
const validate = require("../middlewares/schema-validator");
const { loginSchema } = require("../validator/auth");

router.post("/login", validate(loginSchema), authController.login);
module.exports = router;
