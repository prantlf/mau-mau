import Player from './Player';
import i18n from '../misc/i18n';

var counter = 0;

class Human extends Player {
  
  constructor() {
    super();

    this.index = ++counter;
  }
  
  chooseCard() {
    return this.game.chooseCard(this);
  }
  
  toString() {
    return i18n.translate('human$[1]', this.index);
  }
  
}

export default Human;
