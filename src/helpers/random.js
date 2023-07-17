const randInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max))
}

const generateId = (n = 4) => {
	return '#' + String(randInt(Math.pow(10, n))).padStart(n, '0')
}

module.exports = {
	randInt, generateId
}