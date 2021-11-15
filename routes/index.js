var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/registration', function(req, res, next) {
  res.render('registration');
});

// router.post('/users/register', function(req, res, next) {
//   let {username, email, password, cpassword} = req.body;

//   console.log({username, email, password, cpassword});
// });

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

module.exports = router;
