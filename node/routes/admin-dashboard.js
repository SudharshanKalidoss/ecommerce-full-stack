const router = require("express").Router();
const dashboardController = require("../controller/dashboard");
router.get("/counts", dashboardController.getDashboardStats);

module.exports = router;