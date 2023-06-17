const get_random_int = (max) => {
	return Math.floor(Math.random() * Math.floor(max))
}

const generate_ID = (n = 4) => {
	return '#' + String(get_random_int(Math.pow(10, n))).padStart(n, '0')
}

module.exports = {
	get_random_int,
	generate_ID
}