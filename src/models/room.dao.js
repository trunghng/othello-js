const cnnPool = require('../configs/db.config')


const getAll = async () => {
	const [rows, _] = await cnnPool.execute('SELECT id FROM rooms')
	return rows.map(row => row.id)
}


const get = async (roomId) => {
	const [rows, _] = await cnnPool.execute('SELECT * from rooms WHERE id = ?', [roomId])
	room = (rows.length == 1) ? rows[0] : null
	return room
}


const add = async (roomId, hostId, status) => {
	await cnnPool.execute('INSERT INTO rooms (id, host_id, status) VALUES (?, ?, ?)',
		[roomId, hostId, status])
}


const update = async (roomId, hostId, visitorId, status=null) => {
	let sets = []
	let values = []
	if (hostId) {
		sets.push('host_id = ?')
		values.push(hostId)
	}
	if (visitorId) {
		sets.push('visitor_id = ?')
		values.push(visitorId)
	}
	if (status) {
		sets.push('status = ?')
		values.push(status)
	}
	values.push(roomId)
	await cnnPool.execute(`UPDATE rooms SET ${sets.join()} WHERE id = ?`, values)
}


const remove = async() => {

}


module.exports = {
	getAll, get, add, update, remove
}