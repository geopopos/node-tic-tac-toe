const  Game = require('./game.js');

class Room {
  constructor(){
    this.maxPlayers =  2;
    this.players = [];
    this.game = new Game();
  }

  full(){
    if(this.players.length == this.maxPlayers){
      return true;
    }else {
      return false;
    }
  }

  addPlayer(player){
    return this.players.push(player) - 1;
  }
}

module.exports = Room;
