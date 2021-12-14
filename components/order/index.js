var express = require("express");
var router = express.Router();
const orderController = require("./orderController");
/* GET home page. */
router.get("/", orderController.list);


module.exports = router;
