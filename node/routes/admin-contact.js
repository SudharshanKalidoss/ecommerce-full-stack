const router = require("express").Router();

const contactController = require("../controller/contact");
const validate = require("../middlewares/schema-validator");
const { contactUpdateSchema } = require("../validator/contact");
const { adminOnly } = require("../middlewares/authenticate");
const upload = require("../middlewares/multer");
const { authenticate } = require("../utils/jwt-helper");

router
  .route("/")
  .get(authenticate, adminOnly, contactController.getContactDetails)
  .put(
    authenticate,
    adminOnly,
    upload.single("logo"),
    validate(contactUpdateSchema),
    contactController.createOrUpdateContactDetails
  );

module.exports = router;