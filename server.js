'use strict';

process.title = 'tic-tac-toe server';

let waitingQueue = [];

let rooms = [];

const game = {
  run: false,
  turn: undefined,
  winner: undefined,
  board: ["", "", "", "", "", "", "", "", ""],
};

const game1 = Object.create(game);

console.log(game1);

const room = {
  maxPlayers: 2,
  players: [],
  game: Object.create(game),
};

console.log(room);

let turnNumber = Math.ceil(Math.random() * 2);
console.log(turnNumber);

turnNumber == 1 ? game.turn = "X" : game.turn = "O";
console.log(game.turn);

const webSocketServerPort = 1337;

const WebSocketServer = require('websocket').server;
const http = require('http');

let clients = [];
let server = http.createServer(function(){
  // process HTTP request.

});

server.listen(webSocketServerPort, function() {
  console.log(`${(new Date())} Server is listening on port ${webSocketServerPort}`);
});

let wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', function(request){
  console.log(`${(new Date())} Connection from origin ${request.origin}`);

  let player = {connection: undefined, type: undefined, index: undefined};

  player.connection = request.accept(null, request.origin);

  player.index = clients.push(player.connection) - 1;

  console.log(`${(new Date())} Connection accpeted.`);

  if(Object.keys(clients).length == 1){
    player.type = "X";
  }else {
    player.type = "O";
    game.run = true;
    clients[0].sendUTF(JSON.stringify({run: true}));
  }

  player.connection.sendUTF(JSON.stringify({type: player.type}));
  player.connection.sendUTF(JSON.stringify(game));

  player.connection.on('message', function(message){
    if(message.type === 'utf8') {
      try {
        var json = JSON.parse(message.utf8Data);
        console.log(json);
      } catch(e) {
        console.log(`This doesn\'t look like valid JSON ${JSON.parse(message.utf8Data)}`);
      }

      if('message' in json){
        // handle players message.
        // send to other players.
      } if ('move' in json){
        console.log(`${player.type} ${game.turn}`);
        if(player.type === game.turn){
          if(!game.board[json.move]){
           game.board[json.move] = player.type;
            if(game.board[0] === player.type && game.board[0] === game.board[1] && game.board[1] === game.board[2]){
              console.log("012");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[3] === player.type &&game.board[3] === game.board[4] &&game.board[4] === game.board[5]){
              console.log("345");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[6] === player.type &&game.board[6] === game.board[7] &&game.board[7] === game.board[8]){
              console.log("678");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[0] === player.type &&game.board[0] === game.board[3] &&game.board[3] === game.board[6]){
              console.log("036");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[1] === player.type &&game.board[1] === game.board[4] &&game.board[4] === game.board[7]){
              console.log("147");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[2] === player.type &&game.board[2] === game.board[5] &&game.board[5] === game.board[8]){
              console.log("258");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[0] === player.type &&game.board[0] === game.board[4] &&game.board[4] === game.board[8]){
              console.log("048");
              game.winner = player.type;
              game.run = false;
            }else if(game.board[2] === player.type &&game.board[2] === game.board[4] &&game.board[4] === game.board[5]){
              console.log("245");
              game.winner = player.type;
              game.run = false;
            }else {
              let full = true;
              for (let cell of game.board){
                if(cell === ""){
                  full = false;
                }
              }
              if(full){
                game.winner = "TIE";
                game.run = false
              }
            }

            console.log(game.winner);

            if(game.run == true){
              game.turn == "X" ? game.turn = "O" : game.turn = "X";
              clients[0].sendUTF(JSON.stringify({turn: game.turn, board: game.board,}));
              clients[1].sendUTF(JSON.stringify({turn: game.turn, board: game.board,}));
            }else {
              clients[0].sendUTF(JSON.stringify({winner: game.winner, run: game.run, board:game.board,}));
              clients[1].sendUTF(JSON.stringify({winner: game.winner, run: game.run, board:game.board,}));
            }
          }else {
            player.connection.sendUTF(JSON.stringify({status: "That space has already been taken"}));
          }
        }else {
          player.connection.sendUTF(JSON.stringify({status: "Wait your god damned turn"}));
        }
        console.log(game.board);
      }

    }
  });
});
