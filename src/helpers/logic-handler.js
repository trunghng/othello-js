const validMoves = (grid, color, n=8) => {
    let validMoves = {}
    // color: 2 for black, 1 for white

    // Diagonal from upper right to bottom left
    for (var row = 0; row < n-2; row++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var col = row; col < n; col++) {
            if (grid[col][n - 1 - col + row] == 0) {
                er = col
                e = n - 1 - col + row
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal1')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[col][n-1 - col + row] != color) {
                if (!(b == -1 && e == -1)) {
                    w = n - 1 - col + row
                }
            } else {
                b = n - 1 - col + row
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal1')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    for (var col = 2; col < n; col++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var row = 0; row <= col; row++) {
            if (grid[row][col - row] == 0) {
                er = row
                e = col - row
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal1')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[row][col - row] != color) {
                if (!(b == -1 && e == -1)) {
                    w = col - row
                }
            } else {
                b = col - row
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal1')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    // Diagonal from upper left to bottom right
    for (var col = 0; col < n-2; col++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var row = 0; row < n - col; row++) {
            if (grid[row][row + col] == 0) {
                er = row
                e = row + col
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal2')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[row][row + col] != color) {
                if (!(b == -1 && e == -1)) {
                    w = row + col
                }
            } else {
                b = row + col
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal2')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    for (var row = 0; row < n-2; row++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var col = 0; col < n - row; col++) {
            if (grid[row + col][col] == 0) {
                er = row + col
                e = col
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal2')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[row + col][col] != color) {
                if (!(b == -1 && e == -1)) {
                    w = col
                }
            } else {
                b = col
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(er + '' + e)) {
                        validMoves[er + '' + e] = []
                    }
                    validMoves[er + '' + e].push('diagonal2')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    // Horzontal
    for (var row = 0; row < n; row++) {
        var b = -1,
            w = -1,
            e = -1
        for (var col = 0; col < n; col++) {
            if (grid[row][col] == 0) {
                e = col
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(row + '' + e)) {
                        validMoves[row + '' + e] = []
                    }
                    validMoves[row + '' + e].push('horizontal')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[row][col] != color) {
                if (!(b == -1 && e == -1)) {
                    w = col
                }
            } else {
                b = col
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(row + '' + e)) {
                        validMoves[row + '' + e] = []
                    }
                    validMoves[row + '' + e].push('horizontal')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    // Vertical
    for (var col = 0; col < n; col++) {
        var b = -1,
            w = -1,
            e = -1
        for (var row = 0; row < n; row++) {
            if (grid[row][col] == 0) {
                e = row
                if (b != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(e + '' + col)) {
                        validMoves[e + '' + col] = []
                    }
                    validMoves[e + '' + col].push('vertical')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[row][col] != color) {
                if (!(b == -1 && e == -1)) {
                    w = row
                }
            } else {
                b = row
                if (e != -1 && w != -1) {
                    if (!validMoves.hasOwnProperty(e + '' + col)) {
                        validMoves[e + '' + col] = []
                    }
                    validMoves[e + '' + col].push('vertical')
                    e = -1
                    w = -1
                } else if (e != -1) {
                    e = -1
                } else if (w != -1) {
                    w = -1
                }
            }
        }
    }

    return validMoves
}


const calScore = (grid) => {
    let black = 0,
        white = 0
    grid.forEach((row) => {
        row.forEach((item) => {
            if (item == 1) {
                white++
            } else if (item == 2) {
                black++
            }
        })
    })
    return [white, black]
}


const flipDiscs = (grid, row, col, color, n=8) => {
    let opponentColor = 2 / color
    if (grid[row][col] == 0) {
        let moveTypes = validMoves(grid, color)[row + '' + col]
        if (moveTypes != undefined) {
            moveTypes.forEach((type) => {
                // console.log(type)
                grid[row][col] = color

                // upper right to bottom left
                if (type === 'diagonal1') {
                    let pr = row + 1,
                        pc = col - 1,
                        or = -1,
                        oc = -1
                    while (pr < n && pc >= 0) {
                        if (grid[pr][pc] == opponentColor) {
                            or = pr
                            oc = pc
                        } else if (grid[pr][pc] == color) {
                            break
                        } else {
                            or = -1
                            oc = -1
                            break
                        }
                        pr++
                        pc--
                    }

                    if (oc > 0 && or < n-1) {
                        if (grid[or + 1][oc - 1] == color) {
                            let ir = or,
                                ic = oc
                            while (ir > row) {
                                grid[ir][ic] = color
                                ir--
                                ic++
                            }
                        }
                    }

                    pr = row - 1, pc = col + 1, or = -1, oc = -1
                    while (pc < n && pr >= 0) {
                        if (grid[pr][pc] == opponentColor) {
                            or = pr
                            oc = pc
                        } else if (grid[pr][pc] == color) {
                            break
                        } else {
                            or = -1
                            oc = -1
                            break
                        }
                        pr--
                        pc++
                    }

                    if (or > 0 && oc < n-1) {
                        if (grid[or - 1][oc + 1] == color) {
                            let ir = or,
                                ic = oc
                            while (ic > col) {
                                grid[ir][ic] = color
                                ir++
                                ic--
                            }
                        }
                    }

                // upper left to bottom right
                } else if (type === 'diagonal2') {
                    let pr = row + 1,
                        pc = col + 1,
                        or = -1,
                        oc = -1
                    while (pr < n && pc < n) {
                        if (grid[pr][pc] == opponentColor) {
                            or = pr
                            oc = pc
                        } else if (grid[pr][pc] == color) {
                            break
                        } else {
                            or = -1
                            oc = -1
                            break
                        }
                        pr++
                        pc++
                    }

                    if (or > 0 && or < n-1) {
                        if (grid[or + 1][oc + 1] == color) {
                            let ir = or,
                                ic = oc
                            while (ir > row) {
                                grid[ir][ic] = color
                                ir--
                                ic--
                            }
                        }
                    }

                    pr = row - 1, pc = col - 1, or = -1, oc = -1
                    while (pr >= 0 && pc >= 0) {
                        if (grid[pr][pc] == opponentColor) {
                            or = pr
                            oc = pc
                        } else if (grid[pr][pc] == color) {
                            break
                        } else {
                            or = -1
                            oc = -1
                            break
                        }
                        pr--
                        pc--
                    }

                    if (or > 0 && or < n-1) {
                        if (grid[or - 1][oc - 1] == color) {
                            let ir = or,
                                ic = oc
                            while (ir < row) {
                                grid[ir][ic] = color
                                ir++
                                ic++
                            }
                        }
                    }

                // vertical
                } else if (type === 'vertical') {
                    let op = -1
                    for (var i = row - 1; i >= 0; i--) {
                        if (grid[i][col] == opponentColor) {
                            op = i
                        } else if (grid[i][col] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && grid[op - 1][col] == color) {
                        for (var i = op; i < row; i++) {
                            grid[i][col] = color
                        }
                    }

                    op = -1
                    for (var i = row + 1; i < n; i++) {
                        if (grid[i][col] == opponentColor) {
                            op = i
                        } else if (grid[i][col] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && op < n-1 && grid[op + 1][col] == color) {
                        for (var i = row + 1; i <= op; i++) {
                            grid[i][col] = color
                        }
                    }

                // horizontal
                } else {
                    let op = -1
                    for (var i = col - 1; i >= 0; i--) {
                        if (grid[row][i] == opponentColor) {
                            op = i
                        } else if (grid[row][i] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && grid[row][op - 1] == color) {
                        for (var i = op; i < col; i++) {
                            grid[row][i] = color
                        }
                    }

                    op = -1
                    for (var i = col + 1; i < n; i++) {
                        if (grid[row][i] == opponentColor) {
                            op = i
                        } else if (grid[row][i] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && op < n-1 && grid[row][op + 1] == color) {
                        for (var i = col + 1; i <= op; i++) {
                            grid[row][i] = color
                        }
                    }
                }
            })
        }
    }
    return grid
}

module.exports = {
    validMoves, flipDiscs, calScore
}
