import Pack from './Pack';

class Stack extends Pack {
  
  drawCardFromTop() {
    var card = this.cards.shift();
    // If the count of card decks is not balanced well with the count of
    // players and the cards they are initially dealt, the drawing stack
    // can run out of cards.
    if (card) {
      this.emit('cards:dropped', [card]);
      return card;
    }
  }

  putCardsToBottom(cards) {
    this.cards.push.apply(this.cards, cards);
    this.emit('cards:received', cards);
  }
  
}

export default Stack;
