// Ludo Game Play

const allPlayers = [["blue", 1],["red",2],["green",2],["yellow",1]];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

let start = false;

let turn = 0;

let rollStatus = true;

let randomNumber = 0;

const homeStretch = 52;

class Piece {
    constructor([color, startPosition]){
        this.startPosition = startPosition;
        this.color = color;
        this.inPlay = false;
        this.finishGame = false;
        this.peiceone = {
            active: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.peicetwo = {
            active: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.peicethree = {
            active: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.peicefour = {
            active: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
    }
}


currentPlayers = currentPlayers.map((arr) => new Piece(arr));

function play(){
    // check whose turn it is
    if(start){
        turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1); 
    }
    // find out if there are any active players
    start = true;
    // deactivate roll
    rollStatus = false;    
}

function move(t,e){
    const clickedPiece = e.target.getAttribute('data-color');
    if(clickedPiece === allPlayers[turn][0]){
        const pos = e.target.getAttribute('data-arg');
        const foundTile = document.getElementById(`pos${4}`);
        foundTile.innerHTML = `<div id="${allPlayers[turn][0]}${pos}" data-color="${allPlayers[turn][0]}" data-arg="${pos}" onclick="move(this,event)"></div>`;
        // psuedo code below begin here
    }
}

function roll(t,event){
    if(rollStatus){
        randomNumber = Math.floor(Math.random() * 6) + 1;
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
        play();
    }
}
