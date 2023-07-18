var socket = io()

const roomId = document.getElementById('room-id').innerHTML
const playerName = document.getElementById('player-name').innerHTML
const message = document.getElementById('message')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const sendBtn = document.getElementById('send-btn')
const readyBtn = document.getElementById('ready-btn')
const startBtn = document.getElementById('start-btn')
const quitBtn = document.getElementById('quit-btn')
const crtTurn = document.getElementById('crt-turn')
const surrenderBtn = document.getElementById('surrender-btn')
const score = document.getElementById('score')
const grid_ = document.getElementById('grid')
const WHITE = 1, BLACK = 2

// ---------------------------------------------
// Room setup handle

window.onload = () => {
    drawGrid()
    socket.emit('create/join', {
        roomId: roomId,
        playerName: playerName
    })
}

socket.on('join', (data) => {
    console.log('A player has joined the room')
    output.innerHTML += '<li><em>' + data.message + '</em></li>'
    startBtn.style.display = 'block'
})

// quitBtn.addEventListener('click', () => {
//     console.log('Sent a room leaving request')

//     socket.emit('leave room', {
//         room: room,
//         nickname: nickname
//     })
// })

// ------------------------------------------------
// Chat handle

// Emit events
message.addEventListener('keypress', () => {
    socket.emit('typing', {
        roomId: roomId
    })
})

sendBtn.addEventListener('click', () => {
    output.innerHTML += '<li><strong>' + playerName + '</strong>: ' + message.value + '</li>'
    console.log('A message has been sent')

    socket.emit('chat', {
        roomId: roomId,
        message: message.value
    })
    message.value = ''
})

// Listen to events
socket.on('typing', (data) => {
    feedback.innerHTML = '<em>' + data.message + '</em>'
})

socket.on('chat', (data) => {
    console.log(`Received a message from ${data.playerName}`)

    feedback.innerHTML = ''
    output.innerHTML += '<li><strong>' + data.playerName + '</strong>: ' + data.message + '</li>'
})

// ------------------------------------------------
// Game handle

let crtPlayer, grid, color
let startEnabled = false
const default_grid = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
] // 0 blank, 1 white, 2 Black

const ready = () => {
    socket.emit('ready', {
        roomId: roomId
    })
    if (readyBtn.innerHTML === 'Ready [x]') {
        console.log('Ready for the game')
        readyBtn.innerHTML = 'Ready [√]'
    } else {
        console.log('Unready for the game')
        readyBtn.innerHTML = 'Ready [x]'
    }
}

const start = () => {
    socket.emit('start', {
        roomId: roomId
    })
}

const move = (event) => {
    const cellId = event.target.id
    const [row, col] = cellId.split('-').slice(1).map(n => parseInt(n, 10))
    console.log(`Request move on (${row},${col})`)

    socket.emit('move', {
        roomId: roomId,
        grid: grid,
        row: row,
        col: col,
        crtPlayer: crtPlayer
    })
}

const surrender = () => {
    console.log('Request surrender')

    socket.emit('surrender', {
        roomId: roomId,
        color: color
    })
}

readyBtn.addEventListener('click', ready)

socket.on('enable start', () => {
    console.log('Game can start')
    startBtn.addEventListener('click', start)
    startEnabled = true
})


socket.on('disable start', () => {
    if (startEnabled) {
        startBtn.removeEventListener('click', start)
        startEnabled = false
    }
})


socket.on('game start', (data) => {
    console.log('Game start')

    setGrid(data.grid, data.message, data.score)
    refreshGrid()
    crtPlayer = data.player
    color = data.color
    if (data.validMoves) {
        displayValidMoves(data.validMoves)
    }
    readyBtn.removeEventListener('click', ready)
    surrenderBtn.addEventListener('click', surrender)
})


socket.on('enable move', () => {
    grid_.addEventListener('click', move)
})


socket.on('disable move', () => {
    grid_.removeEventListener('click', move)
})


socket.on('game over', (data) => {
    console.log('Game over!')

    setGrid(data.grid, data.message, data.score)
    refreshGrid()
    readyBtn.addEventListener('click', ready)
    readyBtn.innerHTML = 'Ready [x]'
    surrenderBtn.removeEventListener('click', surrender)
})


socket.on('move', (data) => {
    console.log('Change turn')

    setGrid(data.grid, data.message, data.score)
    refreshGrid()
    if (data.validMoves) {
        displayValidMoves(data.validMoves)
    }
})


// socket.on('leaving', (data) => {
//     console.log('A player has left the room')

//     output.innerHTML += '<li><em>' + data.message + '</em></li>'
//     resetGrid(default_grid, "", "")
//     refreshGrid()
//     readyBtn.style.display = 'block'
// })


// Draw grid
const drawGrid = (n=8) => {
    for (var r = 0; r < n; r++) {
        let row = document.createElement('div')
        row.setAttribute('class', 'row')
        for (var c = 0; c < n; c++) {
            let cell = document.createElement('div')
            cell.setAttribute('class', 'cell')
            cell.setAttribute('id', `cell-${r}-${c}`)
            let disc = document.createElement('div')
            disc.setAttribute('class', 'disc')
            disc.setAttribute('id', `disc-${r}-${c}`)
            cell.appendChild(disc)
            row.appendChild(cell)
        }
        grid_.appendChild(row)
    }
}


// Suggest moves for player
const displayValidMoves = (validMoves) => {
    validMoves.forEach((move) => {
        let coord = move.split('')
        let row = parseInt(coord[0], 10)
        let col = parseInt(coord[1], 10)
        document.getElementById(`cell-${row}-${col}`).childNodes[0].style.backgroundColor='#1AC007'
    })
}


// Refresh the Othello grid on the screen
const refreshGrid = (n=8) => {
    for (var row = 0; row < n; row++) {
        for (var col = 0; col < n; col++) {
            if (grid[row][col] == 0) {
                document.getElementById(`cell-${row}-${col}`).childNodes[0].style.backgroundColor='#129104'
            } else if (grid[row][col] == WHITE) {
                document.getElementById(`cell-${row}-${col}`).childNodes[0].style.backgroundColor='#FFFFFF'
            } else if (grid[row][col] == BLACK) {
                document.getElementById(`cell-${row}-${col}`).childNodes[0].style.backgroundColor='#000000'
            }
        }
    }
}


const setGrid = (crtGrid, turn, crtScore) => {
    grid = crtGrid
    crtTurn.innerHTML = turn
    score.innerHTML = crtScore
}
