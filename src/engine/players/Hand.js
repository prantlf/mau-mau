import Pack from './../cards/Pack';

// Implements what a hand with cards can do.

class Hand extends Pack {
  
  takeCard(card) {
    this.cards.splice(0, 0, card);
    this.emit('cards:received', [card]);
  }

  dropCard(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.emit('cards:dropped', [card]);
  }

  pickCards(filter) {
    return this.cards.filter(filter || function () {return true;});
  }
  
}

export default Hand;
