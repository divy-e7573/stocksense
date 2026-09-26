const express = require("express");
const auth = require("../middleware/auth");
const { list, create, update, remove } = require("../controllers/productController");

const router = express.Router();

router.use(auth); // all product routes protected

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
