// Ludo Game Play

const allPlayers = [["blue", 2],["red",15],["green",28],["yellow",41]];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

let started = false;

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
    pieceSituation(){
        const {pieceone, piecetwo, piecethree, piecefour} = this;
        return [pieceone, piecetwo, piecethree, piecefour];
    }
    anyPieceActive(){
        return this.pieceSituation().filter(el => !!el.isActive).length;
    }
    findActive(){
        return this.pieceSituation().find(el => el.isActive === true);
    }
}


currentPlayers = currentPlayers.map((arr) => new Piece(arr));


function play(){
    // Does the current Player have any active pieces
    const check = currentPlayers[turn].anyPieceActive();
    if(check === 0){
        // check if randomNumber is 6
        if(randomNumber === 6) {
            rollStatus = false;
            return;
        } else {
            console.log("coming here")
            changeTurn();
            return;
        }
    } else if(check === 1){
        // move piece by randomNumber
        const piece = currentPlayers[turn].findActive();
        // move turn
        changeTurn();
    } else {
        // wait for the move function
    }
    console.log({turn})
    // currentPlayers[turn]
    // deactivate roll
    rollStatus = false;    
}

function changeTurn(){
    turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1);
    document.querySelector('#message').innerHTML = `<h3>${allPlayers[turn][0]}'s turn</h3>`
}

function move(t,e){
    const clickedPiece = e.target.getAttribute('data-color');
    const [whoseTurn, initialPosition] = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const getProps = currentPlayers.find(el => el.color === whoseTurn);
        console.log({getProps});
        const piece = `<div id="${whoseTurn}${convertWordsToNumber(pos)}" data-color="${whoseTurn}" data-arg="${pos}" onclick="move(this,event)"></div>`; 
        if(randomNumber === 6){
            if(!getProps[pos].isActive){
                // const [,startPosition] = allPlayers.find(([color]) => color === whoseTurn);
                t.parentElement.innerHTML = ``;
                document.getElementById(`pos${initialPosition}`).innerHTML = piece;
                getProps[pos].isActive = true;
                getProps[pos].position = 2;
            } else {
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                document.getElementById(`pos${currentPosition}`).innerHTML = ``;
                document.getElementById(`pos${currentPosition + randomNumber}`).innerHTML = piece;
            }
            turn = turn === 0 ? (currentPlayers.length - 1) : (turn - 1);
        } else {
            if(getProps[pos].isActive){
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                document.getElementById(`pos${currentPosition}`).innerHTML = ``;
                document.getElementById(`pos${currentPosition + randomNumber}`).innerHTML = piece;
            } else {
                const { pieceone, piecetwo, piecethree, piecefour } = getProps;
                const check = [pieceone, piecetwo, piecethree, piecefour].map(obj => obj.isActive);
                if(check.some(status => !!status)){
                    alert('Play Another Piece')
                    return;
                } 
            }
        }
        console.log("fullstop")
        rollStatus = true;
        // const foundTile = document.getElementById(`pos${4}`);
        // psuedo code below begin here
        // find out if there are any active players
    }
}

function roll(t,event){
    if(rollStatus){
        randomNumber = Math.floor(Math.random() * 6) + 1;
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
    }
    // if(!started){
    //     started = true;
    //     return;
    // } 
    play();
}

function convertWordsToNumber(strsplit){
    const [,word] = strsplit.split('piece');
    if(word === 'one') return 1;
    if(word === 'two') return 2;
    if(word === 'three') return 3;
    if(word === 'four') return 4;
}
