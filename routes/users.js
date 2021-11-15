var express = require('express');
var router = express.Router();

const UserModel = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// /* REGISTER */
// router.post('/register', (req, res, next) => {
//   let username = req.body.username;
//   let email = req.body.email;
//   let password = req.body.password;
//   let cpassword = req.body.cpassword;

//   // Simple Form Validation:
//   // Username: At least 3 characters
//   // Email: 
//   // Password: At least 6 characters
//   // Password + Confirm Password needs to match

//   let errors = [];

//   if (!username || !email || !password || !cpassword) {
//     errors.push({message: "Please enter all fields."});
//   }

//   if (username.length < 3) {
//     errors.push({message: "Username must be at least 3 characters long."});
//   }

//   if (password.length < 6) {
//     errors.push({message: "Password must be at least 6 characters long."});
//   }

//   if (password != cpassword) {
//     errors.push({message: "Passwords do not match."});
//   }

//   if (errors.length > 0) {
//     res.render('registration', { errors });
//   } else {

//   }

// });

module.exports = router;
