const logicHandler = require('./helpers/logic-handler')
const random = require('./helpers/random')

let rooms = {
    /* roomId: {
        players: [socketId1, socketId2],
        readyStatus: {}
        turn: 0/1,
        grid: ...,
        gameOver: true/false
    } */
}

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

class Room {

    constructor(players, readyStatus, turn, grid, gameOver) {
        this._players = players
        this._readyStatus = readyStatus
        this._turn = turn
        this._grid = grid
        this._gameOver = gameOver
    }

    get players() {
        return this._players
    }

    set_players(player, join) {
        if (join) {
            this._players.push(player)
        } else {
            this._players = this._players.filter((i) => {i !== player})
        }
    }

    get ready_status() {
        return this._ready_status
    }

    set_ready_status(player, ready) {
        if (ready) {
            this._ready_status[player] = 'ready'
        } else {
            this._ready_status[player] = 'not ready'
        }
    }

    get turn() {
        return this._turn
    }

    set_turn(turn) {
        this._turn = turn
    }

    get grid() {
        return this._grid
    }

    set_grid(grid) {
        this._grid = grid
    }

    get game_over() {
        return this._game_over
    }

    set_game_over(over) {
        this._game_over = over
    }
}


module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('create/join room', (data) => responseOnCreateJoinRoom(data, socket))

        socket.on('typing', (data) => responseOnTyping(data, socket))

        socket.on('chat', (data) => responseOnChat(data, socket))

        // socket.on('leave room', (data) => responseOnLeaveRoom(data, socket))

        // socket.on('ready', (data) => responseOnReady(data, socket))

        // socket.on('move', (data) => reponseOnMove(data, socket))

        // socket.on('surrender', (data) => responseOnSurrender(data, socket))
    })
}


const responseOnCreateJoinRoom = (data, socket) => {
    console.log(`Received a room creating/joining request with ID ${data.roomId}`)
    socket.join(data.roomId)

    socket.emit('create/join room', {
        message: 'Welcome to the game!'
    })

    socket.to(data.roomId).emit('join room', {
        message: `${data.playerName} has joined the game`
    })
}

const responseOnTyping = (data, socket) => {
    socket.to(data.roomId).emit('typing', {
        message: `${data.playerName} is typing...`
    })
}

const responseOnChat = (data, socket) => {
    console.log(`Received a message from ${data.playerName}`)

    socket.to(data.roomId).emit('chat', {
        playerName: data.playerName,
        message: data.message
    })
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

// const responseOnReady = (data, socket) => {
//     console.log('Received a ready status')

//     if (rooms[data.room].ready_status[socket.id] === 'ready') {
//         console.log('A player is not ready')

//         rooms[data.room].set_ready_status(socket.id, false)
//     } else {
//         console.log('A player is ready')

//         rooms[data.room].set_ready_status(socket.id, true)
//         if (rooms[data.room].ready_status[rooms[data.room].players[0]] === 'ready' && rooms[data.room].ready_status[rooms[data.room].players[1]] === 'ready') {
//             console.log('Game start!')

//             newGame(data.room)
//             rooms[data.room].set_game_over(false)

//             let player_black = random.randInt(2)

//             io.to(rooms[data.room].players[player_black]).emit('start game', {
//                 player: 2,
//                 grid: rooms[data.room].grid,
//                 message: 'You are Black, go first',
//                 valid_moves: Object.keys(logicHandler.get_valid_moves(rooms[data.room].grid, 2)),
//                 score: 'White: 2 - 2 :Black'
//             })

//             io.to(rooms[data.room].players[1 - player_black]).emit('start game', {
//                 player: 1,
//                 grid: rooms[data.room].grid,
//                 message: "You are White, wait for opponent's move",
//                 score: 'White: 2 - 2 :Black'
//             })
//         }
//     }
// }


// function reponseOnMove(data, socket) {
//     console.log('Received a checker moving request')

//     var new_grid
//     if (rooms[data.room].status === 'waiting') {
//         return
//     }
//     else if (data.player === rooms[data.room].turn && Object.keys(logicHandler.get_valid_moves(data.grid, data.player)).includes(data.row + '' + data.col)) {
//         new_grid = logicHandler.flip_discs(rooms[data.room].grid, data.row, data.col, data.player)
//         console.log(new_grid)

//         let score = logicHandler.calculate_score(new_grid)
//         let player_color = (data.player === 1) ? 'White' : 'Black'
//         let opponent_color = (data.player === 1) ? 'Black' : 'White'
//         let end = gameEnded(new_grid)

//         if (end) {
//             console.log('Game over!')

//             rooms[data.room].set_game_over(true)

//             let draw, player_win
//             if (score[0] == score[1]) {
//                 draw = true
//                 player_win = false
//             } else if (score[0] > score[1]) { // White wins
//                 draw = false
//                 if (player_color === 'White') {
//                     player_win = true
//                 } else {
//                     player_win = false
//                 }
//             } else {
//                 draw = false
//                 if (player_color === 'Black') {
//                     player_win = true
//                 } else {
//                     player_win = false
//                 }
//             }

//             if (draw) {
//                 console.log('Draw')

//                 io.in(data.room).emit('game over', {
//                     grid: new_grid,
//                     message: 'Game over! Click ready to start the game!',
//                     score: `Draw! Final Score: White: ${score[0]} - ${score[1]} :Black`
//                 })
//             } else {
//                 console.log(`Final Score: White: ${score[0]} - ${score[1]} :Black`)

//                 if (player_win) {
//                     socket.emit('game over', {
//                         grid: new_grid,
//                         message: 'Game over! Click ready to start the game!',
//                         score: `You win! Final Score: White ${score[0]} - ${score[1]} :Black`
//                     })

//                     socket.to(data.room).emit('game over', {
//                         grid: new_grid,
//                         message: 'Game over! Click ready to start the game!',
//                         score: `You lose! Final Score: White ${score[0]} - ${score[1]} :Black`
//                     })
//                 } else {
//                     socket.emit('game over', {
//                         grid: new_grid,
//                         message: 'Game over! Click ready to start the game!',
//                         score: `You lose! Final Score: White ${score[0]} - ${score[1]} :Black`
//                     })

//                     socket.to(data.room).emit('game over', {
//                         grid: new_grid,
//                         message: 'Game over! Click ready to start the game!',
//                         score: `You win! Final Score: White ${score[0]} - ${score[1]} :Black`
//                     })
//                 }
//             }
//         } else {
//             let opponent = 2 / data.player
//             let valid_moves = Object.keys(logicHandler.get_valid_moves(new_grid, opponent))

//             if ((valid_moves.length === 0)) {
//                 socket.emit('move', {
//                     grid: new_grid,
//                     message: `You are ${player_color}, ${opponent_color} has no available moves, your turn!`,
//                     valid_moves: Object.keys(logicHandler.get_valid_moves(new_grid, data.player)),
//                     score: `White: ${score[0]} - ${score[1]} :Black`
//                 })

//                 socket.to(data.room).emit('move', {
//                     grid: new_grid,
//                     message: `You are ${opponent_color}, There are no available moves for you, wait for opponent's moves!`,
//                     score: `White: ${score[0]} - ${score[1]} :Black`
//                 })
//             } else {
//                 setRoom(opponent, new_grid, data.room)
//                 console.log('Change turn')

//                 socket.emit('move', {
//                     grid: new_grid,
//                     message: `You are ${player_color}, wait for opponent's move`,
//                     score: `White: ${score[0]} - ${score[1]} :Black`
//                 })

//                 socket.to(data.room).emit('move', {
//                     grid: new_grid,
//                     message: `You are ${opponent_color}, your turn!`,
//                     valid_moves: valid_moves,
//                     score: `White: ${score[0]} - ${score[1]} :Black`
//                 })
//             }
//         }
//     }
// }


// function newGame(room) {
//     setRoom(2, default_grid, room)
//     let players = rooms[room].players
//     rooms[room].set_ready_status(players[0], false)
//     rooms[room].set_ready_status(players[1], false)
// }


// function setRoom(player, grid, room) {
//     rooms[room].set_turn(player)
//     rooms[room].set_grid(grid)
// }


// function gameEnded(grid) {
//     console.log(`Valid moves: ${Object.keys(logicHandler.get_valid_moves(grid, 1))}`)
//     console.log(`Valid moves: ${Object.keys(logicHandler.get_valid_moves(grid, 2))}`)
//     return Object.keys(logicHandler.get_valid_moves(grid, 1)).length === 0 && Object.keys(logicHandler.get_valid_moves(grid, 2)).length === 0
// }


// function responseOnSurrender(data, socket) {
//     console.log(`Received a surrender request from ${data.nickname}`)

//     if (!rooms[data.room].game_over) {
//         console.log(`Surrender request from ${data.nickname} is accepted`)

//         socket.to(data.room).emit('surrender', {
//             message: 'Game over! Click ready to start the game!',
//             score: `${data.nickname} surrendered! You win!`
//         })

//         socket.emit('surrender', {
//             message: 'Game over! Click ready to start the game!',
//             score: `You surrendered! You lose!`
//         })
//     }
// }