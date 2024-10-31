// Ludo Game Play

const allPlayers = ["blue","red","green","yellow"];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

const disabled = allPlayers.map(color => ({color, disabledStatus: false}));

let started = false;

let turn = 0;

let rollStatus = true;

let randomNumber = 0;

const protectedPieces = [];

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
            pieceNumber: 1,
            finish: false,
            sumOfMoves: -6,
            position: null,
        };
        this.piecetwo = {
            isActive: false,
            protection: false,
            pieceNumber: 2,
            finish: false,
            sumOfMoves: -6,
            position: null
        };
        this.piecethree = {
            isActive: false,
            protection: false,
            pieceNumber: 3,
            finish: false,
            sumOfMoves: -6,
            position: null
        };
        this.piecefour = {
            isActive: false,
            protection: false,
            pieceNumber: 4,
            finish: false,
            sumOfMoves: -6,
            position: null
        };
    }
    reset(whichPiece){
        this[whichPiece].isActive = false;
        this[whichPiece].sumOfMoves = -6;
        this[whichPiece].position = null;
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
    findPiece(num){
        return this.pieceSituation().find(p => p.pieceNumber === num);
    }
}

currentPlayers = currentPlayers.map((arr) => new Piece(arr));

function play(){
    // Does the current Player have any active pieces
    if(randomNumber !== 6){
        const check = currentPlayers[turn].anyPieceActive();
        if(check <= 1 ){
            if(check === 1){
                // move piece by randomNumber
                const piece = currentPlayers[turn].findActive();
                const whoseTurn = allPlayers[turn];
                // move piece
                const pieceToMove = document.getElementById(`${whoseTurn}${piece.pieceNumber}`);
                console.log('line 89')
                piece.sumOfMoves += randomNumber;
                tileStatus(piece.position, randomNumber, pieceToMove, `pos${piece.position}`);
                piece.position  = piece.position + randomNumber;
            }
            // if no active piece and random number is not 6 move on
            changeTurn();
        }  
    }
}

function changeTurn(){
    turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1);
    document.querySelector('#message').innerHTML = `<h3>${allPlayers[turn]}'s turn</h3>`;    
}

function move(t,e){
    console.log({moveRoll: rollStatus})
    const clickedPiece = e.target.getAttribute('data-color');
    const whoseTurn = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const id = e.target.getAttribute('id');
        const piece = document.getElementById(id);
        const getProps = currentPlayers.find(el => el.color === whoseTurn);
    
        if(randomNumber === 6){
            // console.log({props: getProps, pos, piece, typ: typeof piece})
            if(!getProps[pos].isActive){
                t.parentElement.innerHTML = ``;
                document.getElementById(`pos${getProps.startPosition}`).innerHTML = ``;
                document.getElementById(`pos${getProps.startPosition}`).appendChild(piece);
                getProps[pos].isActive = true;
                getProps[pos].position = getProps.startPosition;
                getProps[pos].sumOfMoves += randomNumber;
                changeTurn();
                return;
            } else {
                const getTurn = disabled.find(el => el.color === allPlayers[turn]);
                console.log({getTurn})
                if(!getTurn.disabledStatus){
                    getProps[pos].sumOfMoves += randomNumber;
                    const { position: currentPosition } = getProps[pos]
                    getProps[pos].position += randomNumber;
                    // check if the cell is protected
                    console.log('line 140')
                    tileStatus(currentPosition, randomNumber, piece);
                    getTurn.disabledStatus = true
                }
            }
        } else {
            if(getProps[pos].isActive){
                getProps[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = getProps[pos]
                getProps[pos].position += randomNumber;
                console.log('line 149')
                console.log({sum2: getProps[pos].sumOfMoves});
                tileStatus(currentPosition, randomNumber, piece, t);
                // document.getElementById(`pos${(currentPosition + randomNumber) > 52 ? 1 : (currentPosition + randomNumber)}`).innerHTML = piece;
                changeTurn();
            }
        }
        // rollStatus = true;
    }
}

function roll(t,event){
    console.log('clicked to roll', {rollStatus})
    if(rollStatus){
        // randomNumber = Math.floor(Math.random() * 6) + 1;
        if(disabled[turn].disabledStatus) disabled[turn].disabledStatus = false;
        randomNumber = Number(prompt('Please Enter A Number'));
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
        play();
    }
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
};

function tileStatus(currentPosition, randomNumber, piece, id){
    
    let answer = currentPosition+randomNumber
    let getString = piece.getAttribute('id');
    const pieceNum = Number(getString[getString.length - 1]);
    getString = getString.substring(0, getString.length - 1);
    const player = currentPlayers.find(el => el.color === getString);
    const foundPiece = player.findPiece(pieceNum);

    console.log({foundPiece, sum: foundPiece.sumOfMoves})

    if(answer > 52){
        answer -= 52;
        foundPiece.position = answer;
    }

    if(foundPiece.sumOfMoves > 50){
        const formString = `${getString}Home${answer}`
        console.log('reaching here', {getString,formString, answer,pieceId: piece.getAttribute('id')});
        document.getElementById(formString).append(document.getElementById(`${piece.getAttribute('id')}`));
        document.getElementById(`pos${currentPosition}`).innerHTML = '';
        return;
    }
    // console.log({currentPosition, randomNumber, piece, id, answer, checkPosition: piece.getAttribute('id')})
    
    const isProtectedFrom = !!document.getElementById(`pos${currentPosition}`).getAttribute('data-protected');
    const isProtectedTo = !!document.getElementById(`pos${answer}`).getAttribute('data-protected');
    if(isProtectedTo){
        // how many peices are on the board
        const piecesOnSquare = document.getElementById(`pos${(answer)}`).children;
        // console.log({piecesOnSquare, length: piecesOnSquare.length, turn: allPlayers[turn]})
        if(piecesOnSquare.length === 1 && allPlayers[turn] !== piecesOnSquare[0].getAttribute('data-color')){
            // if only one piece and different color return him to default location
            const back2Default = document.getElementById(`pos${(answer)}`).children[0];
            // console.log({pieces: piecesOnSquare, selected: piecesOnSquare[0]})
            const foundIndex = currentPlayers.findIndex(player => player.color === piecesOnSquare[0].getAttribute('data-color'));
            currentPlayers[foundIndex].reset(back2Default.getAttribute('data-arg'))
            document.getElementById(`${back2Default.getAttribute('data-color')}-${back2Default.getAttribute('data-arg')}`).append(back2Default);
            // document.getElementById(`pos${(answer)}`).innerHTML = '';
        }
    } else {
        document.getElementById(`pos${answer}`).innerHTML = '';
    } 
    console.log('fullstop');
    // check sum to see if you will divert to homeStretch
    console.log({piece, appended: document.getElementById(id), id});
    // document.getElementById(`pos${checkMyAnswer}`).appendChild(piece);
    document.getElementById(`pos${answer}`).appendChild(document.getElementById(`${piece.getAttribute('id')}`));
    if(isProtectedFrom){
        // find out how many pieces are in the same position
        // if none empty then place star    
        document.getElementById(`pos${currentPosition}`).innerHTML = '';    
        const star = document.createElement('span');
        star.setAttribute('class','star');
        star.innerHTML = `&#9733`;
        document.getElementById(`pos${currentPosition}`).appendChild(star);
        // otherwise search for pieces on this position and return them
    } else {
        document.getElementById(`pos${currentPosition}`).innerHTML = ``;
    }
};
