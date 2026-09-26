const express = require("express");
const auth = require("../middleware/auth");
const { list, create, validate } = require("../controllers/deliveryController");

const router = express.Router();

router.use(auth);

router.get("/", list);
router.post("/", create);
router.patch("/:id/validate", validate);

module.exports = router;
