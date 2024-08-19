// Ludo Game Play

const allPlayers = ["blue","red","green","yellow"];

const numberOfPlayer = Number(prompt('Choose Number Of Players between 1 - 4'));

let currentPlayers = allPlayers.slice(0,numberOfPlayer);

const pieceProps = {active: false, finish: false, position: []}


function play(){
    // check whose turn it is
    // find out if there are any active players
}

function move(t,e){
    // console.log('we move',e.target.getAttribute('data-arg'))
    console.log('we move',{t},{eNum: e.target.getAttribute('data-arg')});
}