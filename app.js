// Ludo Game Play

const allPlayers = ["blue","red","green","yellow"];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

// const disabled = allPlayers.map(color => ({color, disabledStatus: false}));

const protectedTileStatus = [2,10,15,23,28,36,41,49].map(num => ({tileNumber: num, currentPieces: []}));

// let started = false;

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
            pieceNumber: 1,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
        this.piecetwo = {
            isActive: false,
            pieceNumber: 2,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
        this.piecethree = {
            isActive: false,
            pieceNumber: 3,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
        this.piecefour = {
            isActive: false,
            pieceNumber: 4,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
    }
    reset(whichPiece){
        this[whichPiece].isActive = false;
        this[whichPiece].sumOfMoves = -6;
        this[whichPiece].position = null;
    }
    pieceDetails(){
        const {pieceone, piecetwo, piecethree, piecefour} = this;
        return [pieceone, piecetwo, piecethree, piecefour];
    }
    findActivePieces(){
        return this.pieceDetails().filter(el => el.isActive);
    }
    findActive(){
        return this.pieceDetails().find(el => el.isActive === true);
    }
    findPiece(num){
        return this.pieceDetails().find(p => p.pieceNumber === num);
    }
    checkFinish(){
        return this.pieceDetails().every(p => !!p.finish);
    }
    piecesHidden(){
        return this.pieceDetails().filter(p => p.hidden);
    }
}

currentPlayers = currentPlayers.map((arr) => new Piece(arr));

function playSingleTile(){
    if(randomNumber !== 6){
        // Does the current Player have any active pieces
        const activePieces = currentPlayers[turn].findActivePieces();
        const numOfActivePieces = activePieces.length;
        const whoseTurn = allPlayers[turn];
        // if(numOfActivePieces > 1) return;
        if(numOfActivePieces === 1){
            // move piece by randomNumber
            const piece = currentPlayers[turn].findActive();
            // move piece
            automaticMove(piece, whoseTurn);
            console.log('line 89')
        } else if (numOfActivePieces === 2 && activePieces[0].position === activePieces[1].position){
            // move piece
            automaticMove(activePieces[1], whoseTurn);
            console.log('line 121');
        } else if(numOfActivePieces === 0){
            randomNumber = 0;
            changeTurn();  
            rollStatus = true;        
        } 
        
    }
}

function changeTurn(){
    // find out whose turn it is
    turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1);
    document.querySelector('#message').innerHTML = `<h3>${allPlayers[turn]}'s turn</h3>`;
    // find out if there are any hidden pieces
    const hiddenPieces = currentPlayers[turn].piecesHidden();
    console.log({hiddenPieces});
    // display hidden pieces    
    if(hiddenPieces.length){
        hiddenPieces.forEach(({ pieceNumber, position }) => {
            const color = allPlayers[turn];
            const newTile = createTile({id: `${color}${pieceNumber}`, arg: `piece${convertNumbersToWords(pieceNumber)}`,color },false);
            document.getElementById(`pos${position}`).innerHTML = '';
            document.getElementById(`pos${position}`).appendChild(newTile);
        });
    };
}

function automaticMove(piece, turn){
    const pieceToMove = document.getElementById(`${turn}${piece.pieceNumber}`);
    piece.sumOfMoves += randomNumber;
    tileStatus(piece.position, randomNumber, pieceToMove, `pos${piece.position}`);
    if(piece.sumOfMoves < 50){
        piece.position  = piece.position + randomNumber;
    }
    randomNumber = 0;
    // if no active piece
    changeTurn();  
    rollStatus = true;
}

function move(t,e){
    if(randomNumber === 0) return;
    const clickedPiece = e.target.getAttribute('data-color');
    const whoseTurn = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const id = e.target.getAttribute('id');
        const piece = document.getElementById(id);
        const currentPlayer = currentPlayers.find(el => el.color === whoseTurn);
    
        if(randomNumber === 6){
            if(!currentPlayer[pos].isActive){
                t.parentElement.innerHTML = ``;
                document.getElementById(`pos${currentPlayer.startPosition}`).innerHTML = ``;
                document.getElementById(`pos${currentPlayer.startPosition}`).appendChild(piece);
                currentPlayer[pos].isActive = true;
                currentPlayer[pos].position = currentPlayer.startPosition;
                currentPlayer[pos].sumOfMoves += randomNumber;
                currentPlayer[pos].hidden = true;
                protectedTileStatus.find(tile => tile.tileNumber === currentPlayer.startPosition).currentPieces.push(piece);
                changeTurn();
            } else {
                    currentPlayer[pos].sumOfMoves += randomNumber;
                    const { position: currentPosition } = currentPlayer[pos];
                    currentPlayer[pos].position += randomNumber;
                    tileStatus(currentPosition, randomNumber, piece);
                    // check if the cell is protected
                    // disable tile so it can't move again with the same random number
                    // disabledTile.disabledStatus = true
            }
        } else {
            if(currentPlayer[pos].isActive){
                currentPlayer[pos].sumOfMoves += randomNumber;
                const { position: currentPosition } = currentPlayer[pos];
                currentPlayer[pos].position += randomNumber;
                tileStatus(currentPosition, randomNumber, piece, t);
                changeTurn();
            }
        }
        rollStatus = true;
    }
    randomNumber = 0;
}

function roll(t,event){
    if(rollStatus){
        // randomNumber = Math.floor(Math.random() * 6) + 1;
        randomNumber = Number(prompt('Please Enter A Number'));
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
        rollStatus = false;
        playSingleTile();
    }
}


function convertNumbersToWords(num){
    if(num === 1) return 'one';
    if(num === 2) return 'two';
    if(num === 3) return 'three';
    if(num === 4) return 'four';
};

function tileStatus(currentPosition, randomNumber, piece, id){
    let answer = currentPosition+randomNumber
    let getString = piece.getAttribute('id');
    const pieceNum = Number(getString[getString.length - 1]);
    getString = getString.substring(0, getString.length - 1);
    const player = currentPlayers.find(el => el.color === getString);
    const foundPiece = player.findPiece(pieceNum);
    const { sumOfMoves } = foundPiece;

    if(answer > 52){
        answer -= 52;
        foundPiece.position = answer;
    } 

    if(sumOfMoves > 50){
        const newHomePosition = sumOfMoves-50;
        if(sumOfMoves < 56){
            const formString = `${getString}Home${newHomePosition}`;
            document.getElementById(formString).append(document.getElementById(`${piece.getAttribute('id')}`));
            foundPiece.homeRun ? document.getElementById(`${getString}Home${newHomePosition-randomNumber}`).innerHTML = '' : document.getElementById(`pos${currentPosition}`).innerHTML = '';
        } else if(sumOfMoves === 56) {
            document.getElementById(`${getString}Home${newHomePosition - randomNumber}`).innerHTML = '';
            foundPiece.finish = true;
            // code to remove him from eligible players when all pieces are off the board
            if(player.checkFinish()){

            }
            return;
        } else {
            foundPiece.sumOfMoves = sumOfMoves - randomNumber;
        }
        foundPiece.homeRun = true;
        return
    }
    
    const isProtectedFrom = document.getElementById(`pos${currentPosition}`).getAttribute('data-protected');
    const isProtectedTo = document.getElementById(`pos${answer}`).getAttribute('data-protected');
    const piecesOnSquare = [].slice.call(document.getElementById(`pos${(answer)}`).children);
    
    //check if future tile is protected
    if(isProtectedTo){
        const tilesOnfoundProtectedTile = protectedTileStatus.find(tile => tile.tileNumber === answer).currentPieces;
        // using a different approach for a stylistick difference i.e making the pieces appear on the board
        // tilesOnfoundProtectedTile.push(createTile(piece));
        // if(pi, trueecesOnSquare.length === 1 && tilesOnfoundProtectedTile.length === 0) document.getElementById(`pos${answer}`).innerHTML = '';
        // this approach hides the tiles untill its there turn to play
        tilesOnfoundProtectedTile.push(piece);
        document.getElementById(`pos${answer}`).innerHTML = '';
        // how many peices are on the board
        foundPiece.hidden = true;
        document.getElementById(`pos${answer}`).appendChild(document.getElementById(`${piece.getAttribute('id')}`));
    } else {
        // when future title is not protected
        console.log({piecesOnSquare})
        if(piecesOnSquare.length === 1){
            if(allPlayers[turn] !== piecesOnSquare[0].getAttribute('data-color')){
                // if only one piece and different color return him to default location
                const back2Default = document.getElementById(`pos${(answer)}`).children[0];
                const foundIndex = currentPlayers.findIndex(player => player.color === piecesOnSquare[0].getAttribute('data-color'));
                currentPlayers[foundIndex].reset(back2Default.getAttribute('data-arg'))
                document.getElementById(`${back2Default.getAttribute('data-color')}-${back2Default.getAttribute('data-arg')}`).append(back2Default);
                // document.getElementById(`pos${(answer)}`).innerHTML = '';
            } else {
                const pieceToHide = document.getElementById(`pos${(answer)}`).children[0].getAttribute('data-arg');
                player[pieceToHide].hidden = true;
                foundPiece.hidden = true;
                document.getElementById(`pos${answer}`).innerHTML = '';
                document.getElementById(`pos${answer}`).appendChild(document.getElementById(`${piece.getAttribute('id')}`));
            }
        };    
    } 
    
    // check sum to see if you will divert to homeStretch
    
    // document.getElementById(`pos${checkMyAnswer}`).appendChild(piece);
    document.getElementById(`pos${answer}`).appendChild(document.getElementById(`${piece.getAttribute('id')}`));
    // handle the tile you are leaving
    if(isProtectedFrom){
        // find out how many pieces are in the same position
        let howManyOnTile = null;
        protectedTileStatus.forEach(protectedTile => {
            if(protectedTile.tileNumber === currentPosition){
                const solution = protectedTile.currentPieces.filter(p => p.dataset.arg !== `piece${convertNumbersToWords(foundPiece.pieceNumber)}`);
                protectedTile.currentPieces = solution;
                howManyOnTile = solution;
            }
        });
        foundPiece.hidden = false;
        // if none empty then place star    
        if(!howManyOnTile.length){
            document.getElementById(`pos${currentPosition}`).innerHTML = '';    
            const star = document.createElement('span');
            star.setAttribute('class','star');
            star.innerHTML = `&#9733`;
            document.getElementById(`pos${currentPosition}`).appendChild(star);
        } else {
            document.getElementById(`pos${currentPosition}`).appendChild(createTile(howManyOnTile[howManyOnTile.length - 1], true));
        }
        // otherwise search for pieces on this position and return them
    } else {
        if(foundPiece.hidden) foundPiece.hidden =  false;
        console.log('*************************handle here *************************')
        document.getElementById(`pos${currentPosition}`).innerHTML = ``;
    }
};

function createTile(piece, checker){
    // Create the inner div
    const innerDiv = document.createElement('div');
    
    if(checker){
        innerDiv.id = piece.getAttribute('id');
        innerDiv.setAttribute('data-color', piece.dataset.color);
        innerDiv.setAttribute('data-arg', piece.dataset.arg);    
    } else {
        innerDiv.id = piece.id;
        innerDiv.setAttribute('data-color', piece.color);
        innerDiv.setAttribute('data-arg', piece.arg);
    }
    innerDiv.setAttribute('onclick', 'move(this,event)');
    
    return innerDiv;
}


// next steps
// populate and de-populate tileStatus Array
// next step below *********************
// dont forget to handle same color tiles on the same unprotected block 