const pgp = require('pg-promise')();
const connection = pgp(process.env.DATABASE_URL || "postgres://postgres:student@localhost:5432/uno");

module.exports = connection;
