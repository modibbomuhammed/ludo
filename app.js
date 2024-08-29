// Ludo Game Play

const allPlayers = ["blue","red","green","yellow"];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

let started = false;

let turn = 0;

let rollStatus = true;

let randomNumber = 0;

const homeStretch = 52;

class Piece {
    constructor(color){
        this.color = color;
        this.inPlay = false;
        this.finishGame = false;
        this.startPosition = color === "blue" ? 2 : color === "red" ? 15 : color === "green" ? 28 : 41;
        this.pieceone = {
            isActive: false,
            protection: false,
            pieceNumber: "one",
            finish: false,
            sumOfMoves: -6,
            position: null
        };
        this.piecetwo = {
            isActive: false,
            protection: false,
            pieceNumber: "two",
            finish: false,
            sumOfMoves: -6,
            position: null
        };
        this.piecethree = {
            isActive: false,
            protection: false,
            pieceNumber: "three",
            finish: false,
            sumOfMoves: -6,
            position: null
        };
        this.piecefour = {
            isActive: false,
            protection: false,
            pieceNumber: "four",
            finish: false,
            sumOfMoves: -6,
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
    if(randomNumber !== 6){
        const check = currentPlayers[turn].anyPieceActive();
        if(check === 0 ){
                // if no active piece and random number is not 6 move on
                changeTurn();
                return;
        } 
        if(check === 1){
            // move piece by randomNumber
            const piece = currentPlayers[turn].findActive();
            const whoseTurn = allPlayers[turn];
            console.log({piece});
            // move piece
            const pieceToMove = `<div id="${whoseTurn}${convertWordsToNumber(piece.pieceNumber)}" data-color="${whoseTurn}" data-arg="piece${piece.pieceNumber}" onclick="move(this,event)"></div>`;
            // document.getElementById(`pos${piece.position}`).innerHTML = "";
            tileStatus(piece.position, randomNumber, pieceToMove, piece);
            document.getElementById(`pos${(piece.position + randomNumber) > 52 ? 1 : (piece.position + randomNumber)}`).innerHTML = pieceToMove;
            piece.sumOfMoves += randomNumber;
            piece.position  = piece.position + randomNumber;
            // move turn
            changeTurn();
            return;
        } 
    }
    rollStatus = false;    
}

function changeTurn(){
    turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1);
    document.querySelector('#message').innerHTML = `<h3>${allPlayers[turn]}'s turn</h3>`
}

function move(t,e){
    console.log({t})
    const clickedPiece = e.target.getAttribute('data-color');
    const whoseTurn = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const getProps = currentPlayers.find(el => el.color === whoseTurn);
        const piece = `<div id="${whoseTurn}${convertWordsToNumber(pos)}" data-color="${whoseTurn}" data-arg="${pos}" onclick="move(this,event)"></div>`;
        if(randomNumber === 6){
            if(!getProps[pos].isActive){
                t.parentElement.innerHTML = ``;
                document.getElementById(`pos${getProps.startPosition}`).innerHTML = piece;
                getProps[pos].isActive = true;
                getProps[pos].position = getProps.startPosition;
                getProps[pos].sumOfMoves += randomNumber;
            } else {
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                // check if the cell is protected
                tileStatus(currentPosition, randomNumber, piece, t);
                document.getElementById(`pos${(currentPosition + randomNumber) > 52 ? 1 : (currentPosition + randomNumber)}`).innerHTML = piece;
            }
        } else {
            if(getProps[pos].isActive){
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                tileStatus(currentPosition, randomNumber, piece, t);
                document.getElementById(`pos${(currentPosition + randomNumber) > 52 ? 1 : (currentPosition + randomNumber)}`).innerHTML = piece;
                changeTurn();
            }
        }
        rollStatus = true;
    }
}

function roll(t,event){
    if(rollStatus){
        randomNumber = Math.floor(Math.random() * 6) + 1;
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
    }
    play();
}

function convertWordsToNumber(strsplit){
    const [checker,word] = strsplit.split('piece');
    if(checker.length){
        if(checker === 'one') return 1;
        if(checker === 'two') return 2;
        if(checker === 'three') return 3;
        if(checker === 'four') return 4;
    } else {
        if(word === 'one') return 1;
        if(word === 'two') return 2;
        if(word === 'three') return 3;
        if(word === 'four') return 4;
    }
}

function tileStatus(currentPosition, randomNumber, piece,t){
    console.log({currentPosition, randomNumber, piece,t})
    const isProtectedFrom = !!document.getElementById(`pos${currentPosition}`).getAttribute('data-protected');
    const isProtectedTo = !!document.getElementById(`pos${currentPosition+randomNumber}`).getAttribute('data-protected');
    if(isProtectedFrom){
        console.log('here')
        document.getElementById(`pos${currentPosition}`).removeChild(t);    
    } else {
        console.log('here 1')
        document.getElementById(`pos${currentPosition}`).innerHTML = ``;
    }
    if(isProtectedTo){
        console.log('here 2', {err: document.getElementById(`pos${(currentPosition + randomNumber)}`), type: typeof(document.getElementById(`pos${(currentPosition + randomNumber)}`))})
        document.getElementById(`pos${(currentPosition + randomNumber)}`).appendChild(piece);    
    } else {
        // how many peices are on the board
        const howMany = document.getElementById(`pos${(currentPosition + randomNumber)}`).children.length;
        console.log('here 3', {howMany,children: document.getElementById(`pos${(currentPosition + randomNumber)}`).children})
        if(howMany === 1){
            const back2Default = document.getElementById(`pos${(currentPosition + randomNumber)}`).children[0];
            document.getElementById(`pos${(currentPosition + randomNumber)}`).firstElementChild()

        }
    }
    document.getElementById(`pos${(currentPosition + randomNumber) > 52 ? 1 : (currentPosition + randomNumber)}`).innerHTML = piece;
}
