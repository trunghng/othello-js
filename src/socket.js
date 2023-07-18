const { validMoves, flipDiscs, calScore } = require('./helpers/logic-handler')
const random = require('./helpers/random')

const WHITE = 1, BLACK = 2
const WHITETXT = 'White', BLACKTXT = 'Black'
const defaultGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]
let rooms = {
    /* roomId: {
        players: [socketId1, socketId2],
        playerNames: {socketId: playerName},
        readyStatus: {socketId: true/false},
        turn: 0/1,
        grid: ...
    } */
}

class Room {

    constructor(host, hostName) {
        this._players = [host]
        this._playerNames = {}
        this._playerNames[host] = hostName
        this._readyStatus = {}
        this._readyStatus[host] = false
        this._turn = undefined
        this._grid = undefined
    }

    get players() {
        return this._players
    }

    get playerNames() {
        return this._playerNames
    }

    get readyStatus() {
        return this._readyStatus
    }

    get turn() {
        return this._turn
    }

    set turn(turn) {
        this._turn = turn
    }

    get grid() {
        return this._grid
    }

    set grid(grid) {
        this._grid = grid
    }

    addPlayer(player, playerName) {
        this._players.push(player)
        this._playerNames[player] = playerName
        this._readyStatus[player] = false
    }

    removePlayer(player) {
        this.players.filter(i => i !== player)
        delete this.playerNames[player]
        delete this.readyStatus[player]
    }

    changeReadyStatus(player) {
        this._readyStatus[player] = !this._readyStatus[player]
    }

    ready() {
        return this.readyStatus[this.players[0]] && this.readyStatus[this.players[1]]
    }

    set(turn, grid) {
        this.turn = turn
        this.grid = grid
    }

}


module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('create/join', (data) => responseOnCreateJoinRoom(data, socket))

        socket.on('typing', (data) => responseOnTyping(data, socket))

        socket.on('chat', (data) => responseOnChat(data, socket))

        // socket.on('leave room', (data) => responseOnLeaveRoom(data, socket))

        socket.on('ready', (data) => responseOnReady(data, socket, io))

        socket.on('start', (data) => responseOnStart(data, socket, io))

        socket.on('move', (data) => reponseOnMove(data, socket, io))

        socket.on('surrender', (data) => responseOnSurrender(data, socket, io))
    })
}


const responseOnCreateJoinRoom = (data, socket) => {
    const { roomId, playerName } = data
    if (rooms.hasOwnProperty(roomId)) {
        console.log(`ROOM ${roomId}| ${playerName} > join`)
        rooms[roomId].addPlayer(socket.id, playerName)
    } else {
        console.log(`ROOM ${roomId}| ${playerName} > host`)
        rooms[roomId] = new Room(socket.id, playerName)
    }
    socket.join(roomId)

    socket.to(roomId).emit('join', {
        message: `${playerName} has joined the game`
    })
}


const responseOnTyping = (data, socket) => {
    const { roomId } = data
    const playerName = rooms[roomId].playerNames[socket.id]
    console.log(`ROOM ${roomId}: ${playerName} > typing`)

    socket.to(roomId).emit('typing', {
        message: `${playerName} is typing...`
    })
}


const responseOnChat = (data, socket) => {
    const { roomId, message } = data
    const playerName = rooms[roomId].playerNames[socket.id]
    console.log(`ROOM ${roomId}| ${playerName} > chat`)

    socket.to(roomId).emit('chat', {
        playerName: playerName,
        message: message
    })
}


const responseOnReady = (data, socket, io) => {
    const room = rooms[data.roomId]
    console.log(`ROOM ${data.roomId}| ${room.playerNames[socket.id]} > ready: ${!room.readyStatus[socket.id]}`)
    room.changeReadyStatus(socket.id)
    if (room.ready()) {
        // Enable the start button the host's UI
        io.to(room.players[0]).emit('enable start')
    } else {
        io.to(room.players[0]).emit('disable start')
    }
}


const newGame = (roomId) => {
    rooms[roomId].set(BLACK, JSON.parse(JSON.stringify(defaultGrid)))
    rooms[roomId].changeReadyStatus(rooms[roomId].players[0])
    rooms[roomId].changeReadyStatus(rooms[roomId].players[1])
}


const responseOnStart = (data, socket, io) => {
    const { roomId } = data
    const room = rooms[roomId]

    newGame(roomId)
    const scoreTxt = 'WHITE 2 - 2 BLACK'
    const playerBlack = random.randInt(2)
    const playerWhite = 1 - playerBlack
    const blackName = room.playerNames[room.players[playerBlack]]
    const whiteName = room.playerNames[room.players[playerWhite]]

    console.log(`ROOM ${roomId}| ${blackName} > BLACK`)
    console.log(`ROOM ${roomId}| ${whiteName} > WHITE`)
    console.log(`ROOM ${roomId}| GAME START`)

    io.to(room.players[playerBlack]).emit('game start', {
        player: BLACK,
        color: BLACKTXT,
        grid: room.grid,
        message: `You are ${BLACKTXT}. Go first!`,
        validMoves: Object.keys(validMoves(room.grid, BLACK)),
        score: scoreTxt
    })
    io.to(room.players[playerBlack]).emit('enable move')

    io.to(room.players[playerWhite]).emit('game start', {
        player: WHITE,
        color: WHITETXT,
        grid: room.grid,
        message: `You are ${WHITETXT}. Wait for opponent!`,
        score: scoreTxt
    })

    // disable start button on the host's UI
    io.to(room[0]).emit('disable start')
}


const gameOver = (grid) => {
    const whiteValidMoves = Object.keys(validMoves(grid, WHITE))
    const blackValidMoves = Object.keys(validMoves(grid, BLACK))
    // console.log(`Valid moves: ${whiteValidMoves}`)
    // console.log(`Valid moves: ${blackValidMoves}`)
    return whiteValidMoves.length === 0 && blackValidMoves.length === 0
}


const reponseOnMove = (data, socket, io) => {
    const { roomId, grid, row, col, crtPlayer } = data
    let [crtColor, opponentColor] = (crtPlayer === WHITE) ? ['WHITE', 'BLACK'] : ['BLACK', 'WHITE']
    let nextGrid

    if (Object.keys(validMoves(grid, crtPlayer)).includes(row + '' + col)) {
        console.log(`ROOM ${roomId}| ${crtColor} > move (${row},${col})`)
        nextGrid = flipDiscs(rooms[roomId].grid, row, col, crtPlayer)

        let score = calScore(nextGrid)
        const scoreTxt = `WHITE ${score[0]} - ${score[1]} BLACK`

        if (gameOver(nextGrid)) {
            let draw, crtPlayerWin
            if (score[0] == score[1]) {
                draw = true
                crtPlayerWin = false
            } else {
                draw = false
                if ((score[0] > score[1] && crtPlayer === WHITE) || (score[0] > score[1] && crtPlayer === BLACK)) {
                    crtPlayerWin = true
                } else {
                    crtPlayerWin = false
                }
            }

            const gameOverMsg = 'Game over! Click ready to start the game!'
            console.log(`ROOM ${roomId}| GAME OVER: ${scoreTxt}`)

            if (draw) {
                io.in(roomId).emit('game over', {
                    grid: nextGrid,
                    message: gameOverMsg,
                    score: `Draw! Final Score: ${scoreTxt}`
                })
            } else {
                if (crtPlayerWin) {
                    socket.emit('game over', {
                        grid: nextGrid,
                        message: gameOverMsg,
                        score: `You win! Final Score: ${scoreTxt}`
                    })
                    socket.to(roomId).emit('game over', {
                        grid: nextGrid,
                        message: gameOverMsg,
                        score: `You lose! Final Score: ${scoreTxt}`
                    })

                } else {
                    socket.emit('game over', {
                        grid: nextGrid,
                        message: gameOverMsg,
                        score: `You lose! Final Score: ${scoreTxt}`
                    })
                    socket.to(roomId).emit('game over', {
                        grid: nextGrid,
                        message: gameOverMsg,
                        score: `You win! Final Score: ${scoreTxt}`
                    })
                }
            }
            io.in(roomId).emit('disable move')
        } else {
            const opponent = 2 / crtPlayer
            const opponentValidMoves = Object.keys(validMoves(nextGrid, opponent))

            if (opponentValidMoves.length === 0) {
                socket.emit('move', {
                    grid: nextGrid,
                    message: `You are ${crtColor}. ${opponentColor} has no available moves. Your turn!`,
                    validMoves: Object.keys(validMoves(nextGrid, crtPlayer)),
                    score: scoreTxt
                })

                socket.to(roomId).emit('move', {
                    grid: nextGrid,
                    message: `You are ${opponentColor}. There are no available moves. Wait for opponent!`,
                    score: scoreTxt
                })
            } else {
                console.log(`ROOM ${roomId}| Turn changed`)
                rooms[roomId].set(opponent, nextGrid)

                socket.emit('move', {
                    grid: nextGrid,
                    message: `You are ${crtColor}. Wait for opponent!`,
                    score: scoreTxt
                })
                socket.emit('disable move')

                socket.to(roomId).emit('move', {
                    grid: nextGrid,
                    message: `You are ${opponentColor}. Your turn!`,
                    validMoves: opponentValidMoves,
                    score: scoreTxt
                })
                socket.to(roomId).emit('enable move')
            }
        }
    }
}


const responseOnSurrender = (data, socket, io) => {
    const { roomId, color } = data
    const gameOverMsg = 'Game over! Click ready to start the game!'
    console.log(`ROOM ${roomId}| ${color} > surrender`)

    socket.to(roomId).emit('game over', {
        grid: rooms[roomId].grid,
        message: gameOverMsg,
        score: `${color} surrendered! You win!`
    })

    socket.emit('game over', {
        grid: rooms[roomId].grid,
        message: gameOverMsg,
        score: `You surrendered! You lose!`
    })
    io.in(roomId).emit('disable move')
}

// function responseOnLeaveRoom(data, socket) {
//     console.log(`Received a room leaving request from ${data.nickname}`)

//     if (rooms[data.room].status === 'waiting') {
//         console.log(`Room ${data.room} has been deleted`)

//         delete rooms[data.room]
//     } else {
//         console.log(`${data.nickname} has left the room ${data.room}`)

//         let opponent_socket_id_index = 1 - rooms[data.room].players.indexOf(socket.id)
//         rooms[data.room].set_status('waiting')
//         rooms[data.room].set_players(socket.id, false)
//         rooms[data.room].set_ready_status(rooms[data.room].players[opponent_socket_id_index], false)

//         socket.to(data.room).emit('leaving', {
//             message: `${data.nickname} has left the game`
//         })
//     }
//     socket.emit('leave successful', {})
//     socket.leave(data.room)
//     socket.disconnect()
// }
