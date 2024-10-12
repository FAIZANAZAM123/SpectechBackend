var express = require('express');
var router = express.Router();
const controller=require('../controller/GetCompany')

router.get('/', controller.GetCompany)
  
module.exports = router;