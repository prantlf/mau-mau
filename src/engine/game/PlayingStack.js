import Pack from './../cards/Pack';
import i18n from '../misc/i18n';

class PlayingStack extends Pack {
  
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
