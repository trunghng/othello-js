const roomDAO = require('../models/room.dao')
const playerDAO = require('../models/player.dao')
const { generateId } = require('../helpers/random')


const createRoom = async (req, res) => {
	const rooms = await roomDAO.getAll()
	let roomId = ''
	while (true) {
		roomId = generateId()
		if (!rooms.includes(roomId))
			break
	}
	const hostName = req.body.hostName
	const status = 'waiting'
	const hostId = await playerDAO.add(hostName)
	await roomDAO.add(roomId, hostId, status)
	return res.render('game.ejs', {
		roomId: roomId, playerName: hostName
	})
}


const joinRoom = async (req, res) => {
	const { roomId, visitorName } = req.body
	const roomInfo = await roomDAO.get(roomId)
	if (roomInfo) {
		// check whether room is available
		if (roomInfo.status == 'waiting') {
			const visitorId = await playerDAO.add(visitorName)
			await roomDAO.update(roomId, undefined, visitorId, 'full')
			return res.render('game.ejs', {
				roomId: roomId, playerName: visitorName
			})
		} else {
			req.session.joinError = 'Room is full'
			res.redirect('back')
		}
	} else {
		req.session.joinError = 'Room does not exist'
		res.redirect('back')
	}
}


const getGame = (req, res) => {
	if (req.body.roomId) { // Joining room request
		joinRoom(req, res)
	} else { // Creating room request
		createRoom(req, res)
	}
}

module.exports = {
	createRoom, joinRoom, getGame
}