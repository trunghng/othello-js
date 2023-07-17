const cnnPool = require('../configs/db.config')

const add = async (playerName) => {
	await cnnPool.execute('INSERT INTO players (name) VALUES (?)', [playerName])
	const [rows, _] = await cnnPool.execute('SELECT LAST_INSERT_ID()')
	return rows[0]['LAST_INSERT_ID()']
}

const remove = async () => {

}

module.exports = {
	add, remove
}