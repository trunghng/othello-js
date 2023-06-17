var config = require('./config.js')
const pgp = require('pg-promise')();

const connection = {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database
	user: config.db.username,
	password: config.db.password
};

const db = pgp(connection);