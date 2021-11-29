const db = require('../db');
var bcrypt = require('bcrypt');
const UserModel = {};

UserModel.create = (username, password, email) => {
    // Bcrypt encrypts passwords for 10 cycles (takes a few seconds).
    // let hashedPassword = bcrypt.hashSync(password, 10);

    // const CREATE_SQL = 'INSERT INTO users (username, email, password, created) VALUES ($1, $2, $3, $4) RETURNING *';
    // return db.one(CREATE_SQL, [username, email.toLowerCase(), hashedPassword, "now()"]);

    return bcrypt.hash(password, 10)
    .then((hashedPassword) => {
        let baseSQL = 'INSERT INTO users (username, email, password, created) VALUES ($1, $2, $3, $4)';
        return db.one(baseSQL, [username, email, hashedPassword, "now()"])
    })
    .then(([results, fields]) => {
        if(results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        } else {
            // User was not created
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));

    // Checks for existing usernames in database
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

UserModel.usernameExists = (username) => {
    return db.any("SELECT * FROM users WHERE username = $1", username)
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    return db.any("SELECT * FROM users WHERE email = $1", email)
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

// UserModel.authenticate = (username, password) => {
//     let userId;
//     let baseSQL = "SELECT id, username, password FROM users WHERE username=$1;";
//     return db
//     .any(baseSQL,[username])
//     .then(([results, fields]) => {
//         if(results && results.length == 1) {
//             userId = results[0].id;
//             return bcrypt.compare(password, results[0].password);
//         } else {
//             return Promise.reject(-1);
//         }
//     })
//     .then((passwordsMatch) => {
//         if(passwordsMatch) {
//             return Promise.resolve(userId);
//         } else {
//             return Promise.resolve(-1);
//         }
//     })
//     .catch((err) => Promise.reject(err));
// }

module.exports = UserModel;