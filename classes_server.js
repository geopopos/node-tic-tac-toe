'use strict';

process.title = 'tic-tac-toe server';

const Queue = require('./modules/queue.js');
const ConnectionManager = require('./modules/connection_manager.js');
const Room = require('./modules/room.js');

// Instantiate connection manager
const cm = new ConnectionManager();

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

  let player = {connection: undefined, type: undefined, index: undefined, room: undefined, ready: false, name: "unknown"};

  player.connection = request.accept(null, request.origin);

  player.index = clients.push(player.connection) - 1;

  console.log(`${(new Date())} Connection accpeted.`);


  player.connection.on('message', function(message){
    if(message.type === 'utf8') {
      try {
        var json = JSON.parse(message.utf8Data);
        console.log(json);
      } catch(e) {
        console.log(`This doesn\'t look like valid JSON ${JSON.parse(message.utf8Data)}`);
      }

      if('name' in json){
        player.name = json.name;
      }
      if('start' in json){
        player.ready = true;
        // Add Player to waiting Queue
        let position = cm.waitingQueue.push(player);
        player.connection.sendUTF(JSON.stringify({status:`You are wating in the queue. number ${position}/${cm.waitingQueue.size()}`}));

        if(cm.roomList.length && !cm.roomList[cm.roomList.length - 1].full()){
          console.log("we got rooms");
          player.room = cm.roomList.length - 1;
          cm.roomList[player.room].addPlayer(player);
          player.type = "O"
          cm.roomList[player.room].game.run = true;
          cm.roomList[player.room].players[0].connection.sendUTF(JSON.stringify({run: true}));
          cm.roomList[player.room].players[0].connection.sendUTF(JSON.stringify({status: `${player.name} has joined the room!`}));
          player.connection.sendUTF(JSON.stringify({room: player.room}));
          player.connection.sendUTF(JSON.stringify({status:`You have been added to a room as "O's"`}));
        }else {
          console.log("no rooms bro");
          // Create new room and add to roomList
          let room = new Room();
          player.type = "X"
          room.addPlayer(player);
          player.room = cm.roomList.push(room) - 1;
          player.connection.sendUTF(JSON.stringify({room: player.room}));
          player.connection.sendUTF(JSON.stringify({status:`You have been added to a room as "X's"`}));
          player.connection.sendUTF(JSON.stringify({status:`Waiting on one more player...`}));
        }

        // console.log(cm.roomList[player.room].players);

        player.connection.sendUTF(JSON.stringify({type: player.type}));
        player.connection.sendUTF(JSON.stringify(cm.roomList[player.room].game));
      }
      if('message' in json){
        // handle players message.
        // send to other players.
      } if ('move' in json){
        console.log(`${player.type} ${cm.roomList[player.room].game.turn}`);
        if(player.type === cm.roomList[player.room].game.turn){
          console.log("move added");
          if(!cm.roomList[player.room].game.board[json.move]){
           cm.roomList[player.room].game.board[json.move] = player.type;
            if(cm.roomList[player.room].game.board[0] === player.type && cm.roomList[player.room].game.board[0] === cm.roomList[player.room].game.board[1] && cm.roomList[player.room].game.board[1] === cm.roomList[player.room].game.board[2]){
              console.log("012");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[3] === player.type &&cm.roomList[player.room].game.board[3] === cm.roomList[player.room].game.board[4] &&cm.roomList[player.room].game.board[4] === cm.roomList[player.room].game.board[5]){
              console.log("345");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[6] === player.type &&cm.roomList[player.room].game.board[6] === cm.roomList[player.room].game.board[7] &&cm.roomList[player.room].game.board[7] === cm.roomList[player.room].game.board[8]){
              console.log("678");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[0] === player.type &&cm.roomList[player.room].game.board[0] === cm.roomList[player.room].game.board[3] &&cm.roomList[player.room].game.board[3] === cm.roomList[player.room].game.board[6]){
              console.log("036");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[1] === player.type &&cm.roomList[player.room].game.board[1] === cm.roomList[player.room].game.board[4] &&cm.roomList[player.room].game.board[4] === cm.roomList[player.room].game.board[7]){
              console.log("147");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[2] === player.type &&cm.roomList[player.room].game.board[2] === cm.roomList[player.room].game.board[5] &&cm.roomList[player.room].game.board[5] === cm.roomList[player.room].game.board[8]){
              console.log("258");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[0] === player.type &&cm.roomList[player.room].game.board[0] === cm.roomList[player.room].game.board[4] &&cm.roomList[player.room].game.board[4] === cm.roomList[player.room].game.board[8]){
              console.log("048");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else if(cm.roomList[player.room].game.board[2] === player.type &&cm.roomList[player.room].game.board[2] === cm.roomList[player.room].game.board[4] &&cm.roomList[player.room].game.board[4] === cm.roomList[player.room].game.board[5]){
              console.log("245");
              cm.roomList[player.room].game.winner = player.type;
              cm.roomList[player.room].game.run = false;
            }else {
              let full = true;
              for (let cell of cm.roomList[player.room].game.board){
                if(cell === ""){
                  full = false;
                }
              }
              if(full){
                cm.roomList[player.room].game.winner = "TIE";
                cm.roomList[player.room].game.run = false
              }
            }

            console.log(cm.roomList[player.room].game.winner);

            if(cm.roomList[player.room].game.run == true){
              cm.roomList[player.room].game.turn == "X" ? cm.roomList[player.room].game.turn = "O" : cm.roomList[player.room].game.turn = "X";
              for (let p of cm.roomList[player.room].players){
                p.connection.sendUTF(JSON.stringify({turn: cm.roomList[player.room].game.turn, board: cm.roomList[player.room].game.board,}));
              }
            }else {
              for (let p of cm.roomList[player.room].players){
                p.connection.sendUTF(JSON.stringify({winner: cm.roomList[player.room].game.winner, run: cm.roomList[player.room].game.run, board:cm.roomList[player.room].game.board,}));
              }
            }
          }else {
            player.connection.sendUTF(JSON.stringify({status: "That space has already been taken"}));
          }
        }else {
          player.connection.sendUTF(JSON.stringify({status: "Wait your god damned turn"}));
        }
        console.log(cm.roomList[player.room].game.board);
      }

    }
  });
});
