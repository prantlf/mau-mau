import Player from './Player';
import i18n from '../misc/i18n';

var counter = 0;

class Computer extends Player {

  constructor() {
    super();

    this.index = ++counter;
  }

  toString() {
    return i18n.translate('computer$[1]', this.index);
  }

}

export default Computer;
