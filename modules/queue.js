class Queue {
  constructor() {
    this.data = [];
  }

  push(item){
    return this.data.unshift(item);
  }
  pop(){
    return this.data.pop();
  }
  first(){
    return this.data[0];
  }
  last(){
    return this.data[this.data.length - 1];
  }
  size() {
    return this.data.length;
  }
}

module.exports = Queue;
