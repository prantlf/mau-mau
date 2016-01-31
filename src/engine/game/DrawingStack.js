import Stack from './../cards/Stack';
import i18n from '../misc/i18n';

class DrawingStack extends Stack {
  
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
  
  toString() {
    return i18n.translate('drawing stack');
  }
  
}

export default DrawingStack;
