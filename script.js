Board = ((num, toWin) => {
    var dimensions = num;
    var field = [];
    for (let i = 0; i < num; i++) {
        var newArr = [];
        for (let j = 0; j < num; j++) {
            newArr.push('.');
        }
        field.push(newArr);
    }

    const action = (rw, cl, mark) => {
        var target = field[rw][cl];
        if (target === '.') {
            field[rw][cl] = mark;
            var grid = document.querySelector('.grid');
            console.log(grid.childNodes);
            grid.childNodes[rw].childNodes[cl].childNodes[0].textContent = mark;
            grid.childNodes[rw].childNodes[cl].childNodes[0].classList.toggle('unclicked');
        }
    }
    const north = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === 0) {
            return 1;
        }
        return 1 + north(mark, rw - 1, cl);
    }

    const east = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (cl === num - 1) {
            return 1;
        }
        return 1 + east(mark, rw, cl + 1);
    }

    const south = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === num - 1) {
            return 1;
        }
        return 1 + south(mark, rw + 1, cl);
    }

    const west = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (cl === 0) {
            return 1;
        }
        return 1 + west(mark, rw, cl - 1);
    }

    const northeast = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === 0 || cl === num - 1) {
            return 1;
        }
        return 1 + northeast(mark, rw - 1, cl + 1);
    }

    const southeast = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === num - 1 || cl === num - 1) {
            return 1;
        }
        return 1 + southeast(mark, rw + 1, cl + 1);
    }

    const southwest = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === num - 1 || cl === 0) {
            return 1;
        }
        return 1 + southeast(mark, rw + 1, cl - 1);
    }

    const northwest = (mark, rw, cl) => {
        if (field[rw][cl] != mark) {
            return 0;
        }
        if (rw === 0 || cl === 0) {
            return 1;
        }
        return 1 + northwest(mark, rw - 1, cl - 1);
    }

    const checkStatus = () => {
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                if (field[i][j] === '.') {
                    continue;
                } else {
                    var mark = field[i][j];
                    return north(mark, i , j) === toWin || east(mark, i , j) === toWin || 
                        south(mark, i , j) === toWin || west(mark, i , j) === toWin ||
                        northeast(mark, i , j) === toWin || southeast(mark, i , j) === toWin || 
                        southwest(mark, i , j) === toWin || northwest(mark, i , j) === toWin;
                }
            }
        }
        return false;
    }

    const reset = () => {
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                field[i][j] = '.';
            }
        }
    }

    const noMovesLeft = () => {
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                if (field[i][j] === '.') {
                    return false
                }
            }
        }
        return true;
    }

    const displayBoard = () => {
        var container = document.querySelector('.container');
        var box = document.createElement('div');
        box.classList.add('grid');
        box.style.gridTemplateColumns = num*150 + 'px';
        box.style.gridTemplateRows = 'repeat(' + num + ', 150px)'; 

        for (let i = 0; i < num; i++) {
            var row = document.createElement('div');
            row.classList.add('row');
            row.style.gridTemplateColumns = 'repeat(' + num + ', 150px)';
            for (let j = 0; j < num; j++) {
                var elem = document.createElement('div');
                elem.classList.add('elem');
                elem.addEventListener('click', (e) => Umpire.doAction(i, j));
                var content = document.createElement('div');
                content.textContent = field[i][j];
                content.classList.add('content');
                content.classList.add('unclicked');
                elem.appendChild(content);
                row.appendChild(elem);
            }
            box.appendChild(row);
        }
        container.appendChild(box);
    }
    return {field, action, checkStatus, reset, noMovesLeft, displayBoard};
})(3, 3);

const Player = (name, mark) => {
    const id = name;
    const marker = mark;

    const myTurn = (rw, cl) => {
        Board.action(rw, cl, marker);
    } 

    return {id, marker, myTurn};
}

var player1 = Player('player1', 'X');
var player2 = Player('player2', 'O');

Umpire = ((playerlist, board) => {
    var active = playerlist[0];

    const win = () => {
        console.log('player ' + Umpire.active.id + ' wins!');
    }

    const draw = () => {
        console.log('its a draw bois');
    }

    const toggle = () => {
        var index = playerlist.indexOf(Umpire.active);

        if (index == (playerlist.length - 1)) {
            Umpire.active = playerlist[0];
        } else {
            Umpire.active = playerlist[index + 1];
        }
    }

    const doAction = (rw, cl) => {
        Umpire.active.myTurn(rw, cl);
        if (board.checkStatus()) {
            win();
        } else if (board.noMovesLeft()) {
            draw();
        } else {
            toggle();
        }
    }

    return {active, win, draw, doAction};
})([player1, player2], Board)

Board.displayBoard();
// Board.reset()
// console.log(Umpire.active);
// console.log(Board.field);
// Umpire.doAction(0,0);
// console.log(Umpire.active);
// console.log(Board.field);
// Umpire.doAction(1,0);
// console.log(Umpire.active);
// Umpire.doAction(0,2);



console.log(Board.field);
console.log(Board.checkStatus());

