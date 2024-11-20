// Ludo Game Play

const allPlayers = ["blue","red","green","yellow"];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

const disabled = allPlayers.map(color => ({color, disabledStatus: false}));

const protectedTileStatus = [2,10,15,23,28,36,41,49].map(num => ({tileNumber: num, currentPieces: []}));

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
            homeRun: false,
            hidden: false
        };
        this.piecetwo = {
            isActive: false,
            protection: false,
            pieceNumber: 2,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
        this.piecethree = {
            isActive: false,
            protection: false,
            pieceNumber: 3,
            finish: false,
            sumOfMoves: -6,
            position: null,
            homeRun: false,
            hidden: false
        };
        this.piecefour = {
            isActive: false,
            protection: false,
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
    checkFinish(){
        return this.pieceSituation().every(p => !!p.finish);
    }
    anyPieceHidden(){
        return this.pieceSituation().filter(p => p.hidden);
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
                if(piece.sumOfMoves < 50){
                    piece.position  = piece.position + randomNumber;
                }
            }
            // if no active piece and random number is not 6 move on
            changeTurn();
        }  
    }
}

function changeTurn(){
    turn = turn === (currentPlayers.length - 1) ? 0 : (turn + 1);
    document.querySelector('#message').innerHTML = `<h3>${allPlayers[turn]}'s turn</h3>`;
    // find out whose turn it is
    const hiddenPieces = currentPlayers[turn].anyPieceHidden();
    if(hiddenPieces.length){
        hiddenPieces.forEach(({ pieceNumber, position }) => {
            const color = allPlayers[turn];
            const newTile = createTile({id: `${color}${pieceNumber}`, arg: `piece${convertNumbersToWords(pieceNumber)}`,color },false);
            document.getElementById(`pos${position}`).innerHTML = '';
            document.getElementById(`pos${position}`).appendChild(newTile);
        })
    }
    // find out if there are any hidden pieces
    // display hidden pieces    
}

function move(t,e){
    const clickedPiece = e.target.getAttribute('data-color');
    const whoseTurn = allPlayers[turn];
    if(clickedPiece === whoseTurn){
        // retriece peice and number
        const pos = e.target.getAttribute('data-arg');
        const id = e.target.getAttribute('id');
        const piece = document.getElementById(id);
        const getProps = currentPlayers.find(el => el.color === whoseTurn);
    
        if(randomNumber === 6){
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
                tileStatus(currentPosition, randomNumber, piece, t);
                // document.getElementById(`pos${(currentPosition + randomNumber) > 52 ? 1 : (currentPosition + randomNumber)}`).innerHTML = piece;
                changeTurn();
            }
        }
        // rollStatus = true;
    }
}

function roll(t,event){
    if(rollStatus){
        // randomNumber = Math.floor(Math.random() * 6) + 1;
        if(disabled[turn].disabledStatus) disabled[turn].disabledStatus = false;
        randomNumber = Number(prompt('Please Enter A Number'));
        t.style.backgroundImage = `url(./assets/images/${randomNumber}.png)`;
        play();
    }
}

// function convertWordsToNumber(strsplit){
//     const [checker,word] = strsplit.split('piece');
//     if(checker.length){
//         if(checker === 'one') return 1;
//         if(checker === 'two') return 2;
//         if(checker === 'three') return 3;
//         if(checker === 'four') return 4;
//     } else {
//         if(word === 'one') return 1;
//         if(word === 'two') return 2;
//         if(word === 'three') return 3;
//         if(word === 'four') return 4;
//     }
// };

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
        if(piecesOnSquare.length === 1 && allPlayers[turn] !== piecesOnSquare[0].getAttribute('data-color')){
            // if only one piece and different color return him to default location
            const back2Default = document.getElementById(`pos${(answer)}`).children[0];
            const foundIndex = currentPlayers.findIndex(player => player.color === piecesOnSquare[0].getAttribute('data-color'));
            currentPlayers[foundIndex].reset(back2Default.getAttribute('data-arg'))
            document.getElementById(`${back2Default.getAttribute('data-color')}-${back2Default.getAttribute('data-arg')}`).append(back2Default);
            // document.getElementById(`pos${(answer)}`).innerHTML = '';
        } else {
            document.getElementById(`pos${answer}`).appendChild(document.getElementById(`${piece.getAttribute('id')}`));
        }
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
// continue from line 253
// dont forget to handle same color tiles on the same block 