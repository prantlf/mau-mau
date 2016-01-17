import i18n from '../misc/i18n';

class Card {
  
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    // No tinkering with the card after it was "printed"
    Object.freeze(this);
  }
  
  toString() {
    return i18n.translate('$[1] $[2]', i18n.translate(this.rank),
        i18n.translate(this.suit));
  }
  
}

export default Card;
