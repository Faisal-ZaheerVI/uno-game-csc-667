const db = require('../db');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport) {
    passport.use(new LocalStrategy(async (username, password, cb) => {
        await db.any('SELECT * FROM users WHERE username=$1', [username], (err, result) => {
          if(err) {
            return cb(err);
          }
      
          if(result.rows.length > 0) {
            const first = result.rows[0]
            bcrypt.compare(password, first.password, function(err, res) {
              if(res) {
                cb(null, { id: first.id, username: first.username});
               } else {
                cb(null, false);
               }
            });
           } else {
             cb(null, false);
           }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser(async (id, cb) => {
        await db.any('SELECT * FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
          if(err) {
            return cb(err);
          }
          cb(null, results.rows[0]);
        });
    });
}

module.exports = initialize;
