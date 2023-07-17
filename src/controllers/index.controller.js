const getHomepage = async (req, res) => {
	if (req.session.joinError) {
		res.locals.joinError = req.session.joinError
	}
	delete req.session.joinError
	return res.render('index.ejs')
}

module.exports = {
	getHomepage
}