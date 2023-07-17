const express = require('express')
const controller = require('../controllers/game.controller')
const router = express.Router()

router.all('/', controller.getGame)

module.exports = router