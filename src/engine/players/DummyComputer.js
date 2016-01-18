import Computer from './Computer';
import i18n from '../misc/i18n';

class DummyComputer extends Computer {

  chooseCard() {
    var playableCards = this.game.rules.pickPlayableCards(this.hand);
    // Play a random playable card from hand, do not change suits by queens
    return new Promise(function (resolve, reject) {
      if (playableCards.length) {
        let cardIndex = Math.trunc(playableCards.length * Math.random());
        resolve(playableCards[cardIndex]);
      } else {
        reject();
      }
    });
  }

  toString() {
    return i18n.translate('dummy $[1]',
      Computer.prototype.toString.apply(this, arguments));
  }

}

export default DummyComputer;
