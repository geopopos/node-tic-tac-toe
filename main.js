const client = function(){
  "use strict";

  const startUI = document.getElementById("start-ui");
  const name = document.getElementById("name");
  const start = document.getElementById("start");
  const status = document.getElementById("status");
  const playerMarker = document.getElementById("player-marker");
  const turnMarker = document.getElementById("turn-marker");

  let opacity = 0.0;

  function fadeIn(){
    opacity = (opacity + 0.01 + (opacity * 0.05));
    status.style.background = `rgba(255, 0, 0, ${opacity})`;
    if(opacity <= 1.0){
        window.requestAnimationFrame(fadeIn);
    }else {
      window.requestAnimationFrame(fadeOut);
    }
  }

  function fadeOut() {
    opacity = (opacity - 0.01 - (opacity * 0.05));
    status.style.background = `rgba(255, 0, 0, ${opacity})`;
    if(opacity >= 0.0){
    window.requestAnimationFrame(fadeOut);
    }
    else {
      status.innerText = "";
    }
  }

  const notify = function(message){
    status.innerText = message;
    let id = window.requestAnimationFrame(fadeIn);
  }

  function updateMarker(element, playerType){
    if(playerType == "X"){
      element.style.background = '#dd00aa';
    }else {
      element.style.background = '#ddaa00';
    }
  }
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  if(!window.WebSocket) {
    status.text("Sorry your browser doesn\`t support WebSocket");
    return;
  }

  let connection = new WebSocket('ws://127.0.0.1:1337');

  const game = {
    run: false,
    room: undefined,
    playerType: undefined,
    playerTurn: undefined,
    board: ["", "", "", "", "", "", "", "", ""],
    cells: document.getElementsByClassName("cell"),
    startClicked(event){
      connection.send(JSON.stringify({start: true, name: name.value}));
      startUI.style.display = "none";
    },
    cellClicked(event) {
      if(game.run){
        let selectedCell = event.target;
        if (selectedCell.getAttribute("class") === "cell"){
          if(game.playerTurn === game.playerType){
            let cell_number = selectedCell.getAttribute("data-cell");
            connection.send(JSON.stringify({move: cell_number}));
          }
        }
      }
    },
    updateBoard(){
      for (let cell of this.cells) {
        let index = cell.getAttribute("data-cell");
        if(game.board[index] === "X"){
          cell.style.background = '#dd00aa';
        }else if(game.board[index] === "O") {
          cell.style.background = '#ddaa00';
        }else {
          cell.style.background = "#00ddaa";
        }
      }
    }
  }

  connection.onopen = function () {
    // connection is opened and ready to use
    notify("Connected");
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
    notify("Sorry, but there\'s something wrong with your connection or the server is down");
  };


  connection.onmessage = function (message) {
    // try to decode json (I assume that each message
    // from server is json)
    try {
      var json = JSON.parse(message.data);
      console.log(json);
    } catch (e) {
      notify(`This doesn\'t look like a valid JSON:
          ${message.data}`);
      return;
    }
    // handle incoming message
    if('type' in json){
      if(json.type){
          game.playerType = json.type;
          updateMarker(playerMarker, game.playerType);
      }
    }
    if('board' in json){
      console.log(json.board);
      game.board = json.board;
      game.updateBoard();
    }
    if('turn' in json){
      game.playerTurn = json.turn;
      updateMarker(turnMarker, game.playerTurn);
    }
    if('run' in json){
      game.run = json.run;
    }
    if('status' in json){
      notify(json.status);
    }
    if('winner' in json){
      if(json.winner == game.playerType){
        notify("You Won!");
      }else{
        if(json.winner != "TIE"){
            notify(`${json.winner}'s Won The Match!'`)
        } else {
          notify(`It is a tie!`);
        }
      }
    }
  }

  name.addEventListener('focus', (event) => {
    if(name.value == "Player"){
      name.value = "";
    }
  }, false);
  name.addEventListener('blur', (event) => {
    if(name.value == ""){
      name.value = "Player";
    }
  }, false);
  start.addEventListener('click', game.startClicked, false);
  document.addEventListener('click', game.cellClicked, false);
  document.addEventListener('touchend', game.cellClicked, false);

}

client();
