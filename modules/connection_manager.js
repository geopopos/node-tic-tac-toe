const Queue = require('./queue.js');

class ConnectionManager {
  constructor(){
    this.waitingQueue = new Queue();
    this.roomList = [];
  }
}

module.exports = ConnectionManager;
