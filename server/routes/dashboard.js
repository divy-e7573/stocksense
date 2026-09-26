const express = require("express");
const auth = require("../middleware/auth");
const { summary } = require("../controllers/dashboardController");

const router = express.Router();

router.use(auth);

router.get("/", summary);

module.exports = router;
