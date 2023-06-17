require('dotenv').config()

const config = {}

config.db = {}
config.web = {}

config.db.user = 'postgres'
config.db.password = 'captainskipper'
config.db.host = 'localhost'
config.db.port = 5432
config.db.database = 'othello'
config.web.port = process.env.PORT || 3000

module.exports = config