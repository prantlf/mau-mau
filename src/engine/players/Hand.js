import Pack from './../cards/Pack';

// Implements what a hand with cards can do.

class Hand extends Pack {
  
  takeCard(card) {
    this.cards.splice(0, 0, card);
    this.emit('cards:received', [card]);
  }

  dropCard(card) {
    var index = this.cards.indexOf(card);
    if (index >= 0) {
      this.cards.splice(index, 1);
      this.emit('cards:dropped', [card]);
    }
  }

  pickCards(filter) {
    return this.cards.filter(filter || function () {return true;});
  }
  
}

export default Hand;
