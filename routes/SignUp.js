var express = require("express");
var router = express.Router();
const controller = require("../controller/SignUp");

router.post("/", controller.SignUp);

module.exports = router;
