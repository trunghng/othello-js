var socket = io()

const roomId = document.getElementById('roomId').innerHTML
const playerName = document.getElementById('playerName').innerHTML
const message = document.getElementById('message')
const sendBtn = document.getElementById('sendBtn')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const readyBtn = document.getElementById('readyBtn')
let quitBtn = document.getElementById('quitBtn')
let colorTurn = document.getElementById('colorTurn')
let surrenderBtn = document.getElementById('surrenderBtn')
let score = document.getElementById('score')

// ---------------------------------------------
// Room setup handle

window.onload = () => {
    socket.emit('create/join room', {
        roomId: roomId,
        playerName: playerName
    })
}

socket.on('create/join room', (data) => {
    console.log('Create/join room successful!')
    output.innerHTML += '<li><em>' + data.message + '</em></li>'
})

socket.on('join room', (data) => {
    console.log('A player has joined the room')
    output.innerHTML += '<li><em>' + data.message + '</em></li>'
})

// End of Room setup handle
// ------------------------------------------------
// Chat handle

// ---------------------------
// Emit events

message.addEventListener('keypress', () => {
    socket.emit('typing', {
        roomId: roomId,
        playerName: playerName
    })
})

sendBtn.addEventListener('click', () => {
    output.innerHTML += '<li><strong>' + playerName + '</strong>: ' + message.value + '</li>'
    console.log('A message has been sent')

    socket.emit('chat', {
        roomId: roomId,
        playerName: playerName,
        message: message.value
    })
    message.value = ''
})

// ---------------------------
// Listen for events

socket.on('typing', (data) => {
    feedback.innerHTML = '<em>' + data.message + '</em>'
})

socket.on('chat', (data) => {
    console.log(`Received a message from ${data.playerName}`)

    feedback.innerHTML = ''
    output.innerHTML += '<li><strong>' + data.playerName + '</strong>: ' + data.message + '</li>'
})

// End of Chat handle
// ------------------------------------------------
// Game handle

var player
var grid
const default_grid = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
] // 1 for White, 2 for Black

// ---------------------------
// Emit events

// quitBtn.addEventListener('click', () => {
//     console.log('Sent a room leaving request')

//     socket.emit('leave room', {
//         room: room,
//         nickname: nickname
//     })
// })

readyBtn.addEventListener('click', () => {
    socket.emit('ready', {
        roomId: roomId
    })
    if (readyBtn.innerHTML === 'Ready [x]') {
        console.log('Ready for the game')
        readyBtn.innerHTML = 'Ready [√]'
    } else {
        console.log('Not ready for the game')
        readyBtn.innerHTML = 'Ready [x]'
    }
})

// surrenderBtn.addEventListener('click', () => {
//     console.log('Sent a surrender request')

//     socket.emit('surrender', {
//         room: room,
//         nickname: nickname
//     })
// })

// function selectCell(row, col) {
//     console.log('Sent a checker moving request')

//     socket.emit('move', {
//         grid: grid,
//         room: room,
//         row: row,
//         col: col,
//         player: player
//     })
// }


// ---------------------------
// Listen for events

// socket.on('leaving', (data) => {
//     console.log('A player has left the room')

//     output.innerHTML += '<li><em>' + data.message + '</em></li>'
//     resetGrid(default_grid, "", "")
//     refreshGrid()
//     readyBtn.style.display = 'block'
// })

// socket.on('leave successful', () => {
//     console.log('Leave room successful')

//     resetGrid(default_grid, "", "")
//     refreshGrid()
//     game_setup.style.display = 'block'
//     game.style.display = 'none'
//     output.innerHTML = ""
// })

// socket.on('start game', (data) => {
//     console.log('Game start!')

//     resetGrid(data.grid, data.message, data.score)
//     refreshGrid()
//     player = data.player
//     if (data.valid_moves) {
//         displayValidMoves(data.valid_moves)
//     }
//     readyBtn.innerHTML = 'Ready [x]'
//     readyBtn.style.display = 'none'
// })

// socket.on('move', (data) => {
//     console.log('Change turn')

//     resetGrid(data.grid, data.message, data.score)
//     refreshGrid()
//     if (data.valid_moves) {
//         displayValidMoves(data.valid_moves)
//     }
// })

// socket.on('game over', (data) => {
//     console.log('Game over!')

//     resetGrid(data.grid, data.message, data.score)
//     refreshGrid()
//     readyBtn.style.display = 'block'
// })

// socket.on('surrender', (data) => {
//     console.log('One player has surrendered')

//     resetGrid(grid, data.message, data.score)
//     readyBtn.style.display = 'block'
// })



// Suggest moves for player
function displayValidMoves(valid_moves) {
    valid_moves.forEach((move) => {
        let coord = move.split('')
        let row = parseInt(coord[0], 10)
        let col = parseInt(coord[1], 10)
        document.getElementById('cell'+row+col).childNodes[0].style.backgroundColor='#1AC007'
    })
}

// Refresh the Othello grid on screen
function refreshGrid() {
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            if (grid[row][col] == 0) {
                document.getElementById('cell'+row+col).childNodes[0].style.backgroundColor='#129104'
            } else if (grid[row][col] == 1) {
                document.getElementById('cell'+row+col).childNodes[0].style.backgroundColor='#FFFFFF'
            } else if (grid[row][col] == 2) {
                document.getElementById('cell'+row+col).childNodes[0].style.backgroundColor='#000000'
            }
        }
    }
}

function resetGrid(crt_grid, turn, crtScore) {
    grid = crt_grid
    colorTurn.innerHTML = turn
    score.innerHTML = crtScore
}

