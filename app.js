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
        this.pieceone = {
            isActive: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.piecetwo = {
            isActive: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.piecethree = {
            isActive: false,
            protection: false,
            finish: false,
            sumOfMoves: 0,
            position: null
        };
        this.piecefour = {
            isActive: false,
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
    } else {
        start = true;
    }
    // deactivate roll
    rollStatus = false;    
}

function move(t,e){
    const clickedPiece = e.target.getAttribute('data-color');
    const [whoseTurn, initialPosition] = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const getProps = currentPlayers.find(el => el.color === whoseTurn);
        console.log({getProps});
        const peice = `<div id="${whoseTurn}${convertWordsToNumber(pos)}" data-color="${whoseTurn}" data-arg="${pos}" onclick="move(this,event)"></div>`; 
        if(randomNumber === 6){
            if(!getProps[pos].isActive){
                // const [,startPosition] = allPlayers.find(([color]) => color === whoseTurn);
                document.getElementById(`pos${initialPosition}`).innerHTML = piece;
                getProps[pos].isActive = true;
                getProps[pos].position = 2;
            } else {
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                document.getElementById(`pos${currentPosition}`).innerHTML = ``;
                document.getElementById(`pos${currentPosition + randomNumber}`).innerHTML = piece;
                turn -= 1;
            }
        }
        // const foundTile = document.getElementById(`pos${4}`);
        // psuedo code below begin here
        // find out if there are any active players
        rollStatus = true;
    }
}

function roll(t,event){
    console.log('here', {rollStatus})
    if(rollStatus){
        randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log({randomNumber})
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
    }
    play();
}

function convertWordsToNumber(strsplit){
    const [,word] = strsplit.split('piece');
    if(word === 'one') return 1;
    if(word === 'two') return 2;
    if(word === 'three') return 3;
    if(word === 'four') return 4;
}
