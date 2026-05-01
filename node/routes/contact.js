const router = require("express").Router();

const contactController = require("../controller/contact");

router.get("/", contactController.getContactDetails);

module.exports = router;