import Pack from './Pack';

class Stack extends Pack {
  
  drawCardFromTop() {
    var card = this.cards.shift();
    this.emit('cards:dropped', [card]);
    return card;
  }

  putCardsToBottom(cards) {
    this.cards.push.apply(this.cards, cards);
    this.emit('cards:received', cards);
  }
  
}

export default Stack;
