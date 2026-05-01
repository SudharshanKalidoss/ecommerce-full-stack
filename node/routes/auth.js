
const router = require("express").Router();
const authController = require('../controller/auth');
const validate = require("../middlewares/schema-validator");
const { loginSchema, userRegistrationSchema } = require("../validator/auth");

router.post("/login", validate(loginSchema), authController.userLogin);
router.post("/register", validate(userRegistrationSchema), authController.userRegistration);
module.exports = router;


