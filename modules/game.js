class Game {
  constructor(){
    this.run = false;
    this.turn = Game.calcTurn();
    this.winner = undefined;
    this.board = ["", "", "", "", "", "", "", "", ""];
  }

  static calcTurn(){
    let turn = undefined;
    let turnNumber = Math.ceil(Math.random() * 2);
    turnNumber == 1 ? turn = "X" : turn = "O";
    return turn;
  }
}

module.exports = Game;
