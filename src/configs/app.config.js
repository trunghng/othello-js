require('dotenv').config()

const config = {}

config.web = {}
config.web.port = process.env.PORT || 3000

module.exports = config