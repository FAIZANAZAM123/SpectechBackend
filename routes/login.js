var express = require("express");
var router = express.Router();
const controller = require("../controller/login");

router.post("/", controller.Login);

module.exports = router;
