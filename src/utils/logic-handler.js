const calculate_score = (grid) => {
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

const flip_discs = (grid, row, col, color) => {
    let opponent_color = 2 / color
    if (grid[row][col] == 0) {
        let move_types = get_valid_moves(grid, color)[row + '' + col]
        if (move_types != undefined) {
            move_types.forEach((type) => {
                console.log(type)
                grid[row][col] = color

                // upper right to bottom left
                if (type === 'diagonal1') {
                    let pr = row + 1,
                        pc = col - 1,
                        or = -1,
                        oc = -1
                    while (pr < 8 && pc >= 0) {
                        if (grid[pr][pc] == opponent_color) {
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

                    if (oc > 0 && or < 7) {
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
                    while (pc < 8 && pr >= 0) {
                        if (grid[pr][pc] == opponent_color) {
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

                    if (or > 0 && oc < 7) {
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
                    while (pr < 8 && pc < 8) {
                        if (grid[pr][pc] == opponent_color) {
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

                    if (or > 0 && or < 7) {
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
                        if (grid[pr][pc] == opponent_color) {
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

                    if (or > 0 && or < 7) {
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
                        if (grid[i][col] == opponent_color) {
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
                    for (var i = row + 1; i < 8; i++) {
                        if (grid[i][col] == opponent_color) {
                            op = i
                        } else if (grid[i][col] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && op < 7 && grid[op + 1][col] == color) {
                        for (var i = row + 1; i <= op; i++) {
                            grid[i][col] = color
                        }
                    }

                    // horizontal
                } else {
                    let op = -1
                    for (var i = col - 1; i >= 0; i--) {
                        if (grid[row][i] == opponent_color) {
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
                    for (var i = col + 1; i < 8; i++) {
                        if (grid[row][i] == opponent_color) {
                            op = i
                        } else if (grid[row][i] == color) {
                            break
                        } else {
                            op = -1
                            break
                        }
                    }
                    if (op > 0 && op < 7 && grid[row][op + 1] == color) {
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

function get_valid_moves(grid, color) {
    let valid_moves = {}
    // color: 2 for black, 1 for white

    // Diagonal from upper right to bottom left
    for (var row = 0; row < 6; row++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var col = row; col < 8; col++) {
            if (grid[col][7 - col + row] == 0) {
                er = col
                e = 7 - col + row
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal1')
                    w = -1
                    b = -1
                } else if (b != -1) {
                    b = -1
                } else if (w != -1) {
                    w = -1
                }
            } else if (grid[col][7 - col + row] != color) {
                if (!(b == -1 && e == -1)) {
                    w = 7 - col + row
                }
            } else {
                b = 7 - col + row
                if (e != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal1')
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

    for (var col = 2; col < 8; col++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var row = 0; row <= col; row++) {
            if (grid[row][col - row] == 0) {
                er = row
                e = col - row
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal1')
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
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal1')
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
    for (var col = 0; col < 6; col++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var row = 0; row < 8 - col; row++) {
            if (grid[row][row + col] == 0) {
                er = row
                e = row + col
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal2')
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
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal2')
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

    for (var row = 0; row < 6; row++) {
        var b = -1,
            w = -1,
            e = -1,
            er = -1
        for (var col = 0; col < 8 - row; col++) {
            if (grid[row + col][col] == 0) {
                er = row + col
                e = col
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal2')
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
                    if (!valid_moves.hasOwnProperty(er + '' + e)) {
                        valid_moves[er + '' + e] = []
                    }
                    valid_moves[er + '' + e].push('diagonal2')
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
    for (var row = 0; row < 8; row++) {
        var b = -1,
            w = -1,
            e = -1
        for (var col = 0; col < 8; col++) {
            if (grid[row][col] == 0) {
                e = col
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(row + '' + e)) {
                        valid_moves[row + '' + e] = []
                    }
                    valid_moves[row + '' + e].push('horizontal')
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
                    if (!valid_moves.hasOwnProperty(row + '' + e)) {
                        valid_moves[row + '' + e] = []
                    }
                    valid_moves[row + '' + e].push('horizontal')
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
    for (var col = 0; col < 8; col++) {
        var b = -1,
            w = -1,
            e = -1
        for (var row = 0; row < 8; row++) {
            if (grid[row][col] == 0) {
                e = row
                if (b != -1 && w != -1) {
                    if (!valid_moves.hasOwnProperty(e + '' + col)) {
                        valid_moves[e + '' + col] = []
                    }
                    valid_moves[e + '' + col].push('vertical')
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
                    if (!valid_moves.hasOwnProperty(e + '' + col)) {
                        valid_moves[e + '' + col] = []
                    }
                    valid_moves[e + '' + col].push('vertical')
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

    return valid_moves
}

module.exports = {
    get_valid_moves,
    flip_discs,
    calculate_score
}
