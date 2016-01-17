import EventEmitter from './../misc/EventEmitter';

class Pack extends EventEmitter {
  
  constructor() {
    super();

    this.cards = [];
  }

  get cardCount() {
    return this.cards.length;
  }

  drawAllCards() {
    var cards = this.cards.splice(0, this.cards.length);
    this.emit('cards:dropped', cards);
    return cards;
  }
  
}

export default Pack;
