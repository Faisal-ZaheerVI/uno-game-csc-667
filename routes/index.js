var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/registration', function(req, res, next) {
  res.render('registration');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

// router.post('/login', function(req, res, next) {
//   res.redirect('/lobby');
// });

router.get('/rules', function(req, res, next) {
  res.render('rules');
});

router.get('/lobby', function(req, res, next) {
  res.render('lobby');
});

router.get('/game', function(req, res, next) {
  res.render('game');
});

/* REGISTER */
router.post('/users/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  // Simple Form Validation:
  // Username: At least 3 characters
  // Email: 
  // Password: At least 6 characters
  // Password + Confirm Password needs to match

  let errors = [];

  if (!username || !email || !password || !cpassword) {
    errors.push({message: "Please enter all fields."});
  }

  if (username.length < 3) {
    errors.push({message: "Username must be at least 3 characters long."});
  }

  if (password.length < 6) {
    errors.push({message: "Password must be at least 6 characters long."});
  }

  if (password != cpassword) {
    errors.push({message: "Passwords do not match."});
  }

  if (errors.length > 0) {
    res.render('registration', { errors });
  } else {

  }

});

module.exports = router;
