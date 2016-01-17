import Stack from './../cards/Stack';
import i18n from '../misc/i18n';

class PlayingStack extends Stack {
  
  peekAtTopCard() {
    return this.cards[0];
  }

  putCardOnTop(card) {
    this.cards.unshift(card);
    this.emit('cards:received', [card]);
  }
  
  toString() {
    return i18n.translate('playing stack');
  }
  
}

export default PlayingStack;
