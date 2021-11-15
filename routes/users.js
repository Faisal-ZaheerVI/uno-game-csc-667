var express = require('express');
var router = express.Router();

const UserModel = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* REGISTER */
router.post('/users/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  console.log({username, email, password, cpassword});
});

module.exports = router;
