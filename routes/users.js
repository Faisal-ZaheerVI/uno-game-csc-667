const express = require('express');
const router = express.Router();
const db = require('../db');

const UserModel = require('../models/Users');
const UserError = require('../helpers/error/UserError');
// const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
// const {registerValidator, loginValidator} = require('../middleware/validation');

const bcrypt = require('bcrypt');
const passport = require('passport');

const initializePassport = require('../config/passport');
initializePassport(passport);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* REGISTER */
router.post('/register', async (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  // Simple Form Validation:
  // All values need to be filled out.
  // Username: At least 3 characters.
  // Password: At least 6 characters.
  // Password + Confirm Password needs to match.

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

  // Form Validation has failed:
  if (errors.length > 0) {
    res.render('registration', { errors });
  } 
  // Form Validation has passed:
  else {
    UserModel.usernameExists(username)
    .then((userNameDoesExist) => {
      if(userNameDoesExist) {
        errors.push({message: "Username already exists."});
        res.render('registration', { errors });
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if(emailDoesExist) {
        errors.push({message: "Email already registered with an account."});
        res.render('registration', { errors });
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if(createdUserId < 0) {
        errors.push({message: "Server Error, user could not be created."});
        res.render('registration', { errors });
        throw new UserError(
          "Server Error, user could not be created",
          "/registration",
          500
        );
      } else {
        req.flash('success', 'User account has been made!');
        req.session.save( err => {
          res.redirect('/login');
        });
      }
    })
    .catch( (error) => {
      console.log( error );
      res.json({ error });
      if(error instanceof UserError) {
        // User error
        // errorPrint(error.getMessage());
        req.flash('error', error.getMessage());
        // res.status(error.getStatus());
        // res.redirect(error.getRedirectURL());
      } else {
        // General Errors
        next(error);
      }
    });

    // // Bcrypt encrypts passwords for 15 cycles (takes a few seconds).
    // let hashedPassword = await bcrypt.hash(password, 15);

    // // Checks for existing usernames in database
    // await db.any('SELECT * FROM users WHERE username = $1', username)
    // .then( result => {
    //   if(result.length > 0) {
    //     errors.push({message: "Username already exists."});
    //     res.render('registration', { errors })
    //   } else {
    //     db.query(`INSERT INTO users ("username", "email", "password", "created") VALUES ($1, $2, $3, $4)`, [username, email, hashedPassword, "now()"])
    //     .then((_) => {
    //       req.flash('success', 'User account has been made!');
    //       res.redirect('/login');
    //     })
    //     .catch( error => {
    //       console.log( error );
    //       res.json({ error });
    //     }); 
    //   }
    // })
    // .catch( error => {
    //     console.log( error );
    //     res.json({ error });
    // });
  }

});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/lobby',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router;
