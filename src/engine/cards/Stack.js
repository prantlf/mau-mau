import Pack from './Pack';

class Stack extends Pack {

  putCardsToBottom(cards) {
    this.cards.push.apply(this.cards, cards);
    this.emit('cards:received', cards);
  }
  
}

export default Stack;
