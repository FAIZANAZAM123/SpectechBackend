var express = require("express");
var router = express.Router();
const controller = require("../controller/SignUpBusiness");

router.post("/", controller.SignUpBusiness);
router.post("/setboxthings", controller.SetBoxThings);

router.post("/getBoxThings", controller.getBoxThings);


module.exports = router;
