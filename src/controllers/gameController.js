const { generate_ID } = require('../utils/random')

const getGame = (req, res) => {
	return res.render('game.ejs')
}

module.exports = {
	getGame
}