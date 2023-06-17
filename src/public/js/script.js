var socket = io()
var nickname, room

let game_setup = document.getElementById("game_setup")
let game = document.getElementById("game")
let nickname_create = document.getElementById("nickname_create")
let nickname_join = document.getElementById('nickname_join')
let create_room = document.getElementById("create_room")
let join_room = document.getElementById("join_room")
let error_msg = document.getElementById("error_msg")
let error_msg_create = document.getElementById('error_msg_create')
let error_msg_join = document.getElementById('error_msg_join')
let createBtn = document.getElementById("createGameBtn")
let message = document.getElementById('message')
let send = document.getElementById('sendBtn')
let output = document.getElementById('output')
let feedback = document.getElementById('feedback')
let readyBtn = document.getElementById('readyBtn')
let quitBtn = document.getElementById('quitBtn')
let colorTurn = document.getElementById('colorTurn')
let surrenderBtn = document.getElementById('surrenderBtn')
let score = document.getElementById('score')
let nickname_create_div = document.getElementById('nicknameCreate')
let nickname_join_div = document.getElementById('nicknameJoin')
let createNameBtn = document.getElementById('createNameBtn')
let joinNameBtn = document.getElementById('joinNameBtn')

// ---------------------------------------------
// Game setup handle

function create_r() {
    create_room.style.display = "block"
    join_room.style.display = "none"
    join_room.value = ''
    error_msg.innerHTML = ''
}

function join_r() {
    create_room.style.display = "none"
    create_room.value = ''
    join_room.style.display = "block"
    error_msg.innerHTML = ''
}

createBtn.addEventListener('click', () => {
    if (create_room.value === '' && join_room.value === '') {
        error_msg.innerHTML = "Room name cannot be blank"

    // emit room creating event
    } else if (create_room.value !== '') {
        console.log('Sent a room creating request')

        socket.emit('create room', {
            room: create_room.value
        })
        create_room.value = ''
        error_msg.innerHTML = ''

    // emit room joining event
    } else {
        console.log('Sent a room joining request')

        socket.emit('join room', {
            room: join_room.value
        })
        join_room.value = ''
        error_msg.innerHTML = ''
    }
})

createNameBtn.addEventListener('click', () => {
    if (nickname_create.value === '') {
        error_msg_create.innerHTML = 'Nickname cannot be blank'
    } else {
        console.log('Sent a nickname creating request')

        socket.emit('create nickname', {
            nickname: nickname_create.value
        })
        nickname_create.value = ''
        error_msg_create.innerHTML = ''
    }
})

joinNameBtn.addEventListener('click', () => {
    if (nickname_join.value === '') {
        error_msg_join.innerHTML = 'Nickname cannot be blank'
    } else {
        console.log('Sent a nickname creating request')

        socket.emit('join nickname', {
            nickname: nickname_join.value,
            room: room
        })
        nickname_join.value = ''
        error_msg_join.innerHTML = ''
    }
})

// End of Game setup handle
// ------------------------------------------------
// Room setup handle

socket.on('create failed', (data) => {
    console.log('Create room failed')

    error_msg.innerHTML = data.message
})

socket.on('create successful', (data) => {
    console.log('Create room successful')

    nickname_create_div.style.display = 'none'
    game.style.display = 'block'
    output.innerHTML += '<li><em>' + data.message + '</em></li>'
    nickname = data.nickname
})

socket.on('join failed', (data) => {
    console.log('Join room failed')

    error_msg.innerHTML = data.message
})

socket.on('join successful', (data) => {
    console.log('Join room successful')

    nickname_join_div.style.display = 'none'
    game.style.display = 'block'
    output.innerHTML += '<li><em>' + data.message + '</em></li>'
    nickname = data.nickname
})

socket.on('joining', (data) => {
    console.log('A player has joined the room')

    output.innerHTML += '<li><em>' + data.message + '</em></li>'
})

socket.on('create nickname', (data) => {
    room = data.room

    nickname_create_div.style.display = 'block'
    game_setup.style.display = 'none'
})

socket.on('join nickname', (data) => {
    room = data.room

    nickname_join_div.style.display = 'block'
    game_setup.style.display = 'none'
})

// window.addEventListener('beforeunload', (e) => {
    
// });

// End of Room setup handle
// ------------------------------------------------
// Chat handle

// ---------------------------
// Emit events

message.addEventListener('keypress', () => {
    socket.emit('typing', {
        room: room,
        nickname: nickname
    })
})

send.addEventListener('click', () => {
    console.log('A message has sent')

    socket.emit('chat message', {
        room: room,
        nickname: nickname,
        message: message.value
    })
    message.value = ''
})

// ---------------------------
// Listen for events

socket.on('typing', (data) => {
    feedback.innerHTML = '<em>' + data.message + '</em>'
})

socket.on('chat message', (data) => {
    console.log('Received a message')

    feedback.innerHTML = ''
    output.innerHTML += '<li><strong>' + data.nickname + '</strong>: ' + data.message + '</li>'
})



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

quitBtn.addEventListener('click', () => {
    console.log('Sent a room leaving request')

    socket.emit('leave room', {
        room: room,
        nickname: nickname
    })
})

readyBtn.addEventListener('click', () => {
    socket.emit('ready', {
        room: room
    })
    if (readyBtn.innerHTML === 'Ready [x]') {
        console.log('Ready for the game')
        readyBtn.innerHTML = 'Ready [√]'
    } else {
        console.log('Not ready for the game')
        readyBtn.innerHTML = 'Ready [x]'
    }
})

surrenderBtn.addEventListener('click', () => {
    console.log('Sent a surrender request')

    socket.emit('surrender', {
        room: room,
        nickname: nickname
    })
})

function selectCell(row, col) {
    console.log('Sent a checker moving request')

    socket.emit('move', {
        grid: grid,
        room: room,
        row: row,
        col: col,
        player: player
    })
}


// ---------------------------
// Listen for events

socket.on('leaving', (data) => {
    console.log('A player has left the room')

    output.innerHTML += '<li><em>' + data.message + '</em></li>'
    resetGrid(default_grid, "", "")
    refreshGrid()
    readyBtn.style.display = 'block'
})

socket.on('leave successful', () => {
    console.log('Leave room successful')

    resetGrid(default_grid, "", "")
    refreshGrid()
    game_setup.style.display = 'block'
    game.style.display = 'none'
    output.innerHTML = ""
})

socket.on('start game', (data) => {
    console.log('Game start!')

    resetGrid(data.grid, data.message, data.score)
    refreshGrid()
    player = data.player
    if (data.valid_moves) {
        displayValidMoves(data.valid_moves)
    }
    readyBtn.innerHTML = 'Ready [x]'
    readyBtn.style.display = 'none'
})

socket.on('move', (data) => {
    console.log('Change turn')

    resetGrid(data.grid, data.message, data.score)
    refreshGrid()
    if (data.valid_moves) {
        displayValidMoves(data.valid_moves)
    }
})

socket.on('game over', (data) => {
    console.log('Game over!')

    resetGrid(data.grid, data.message, data.score)
    refreshGrid()
    readyBtn.style.display = 'block'
})

socket.on('surrender', (data) => {
    console.log('One player has surrendered')

    resetGrid(grid, data.message, data.score)
    readyBtn.style.display = 'block'
})



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

