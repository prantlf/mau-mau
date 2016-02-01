import {expect} from 'chai';
import Reporter from '../../../node/engine/misc/Reporter';
import Game from '../../../node/engine/game/Game';
import Computer from '../../../node/engine/players/Computer';

describe('Reporter', function () {

  class TestComputer extends Computer {

    chooseCard() {
      var playableCards = this.game.rules.pickPlayableCards(this.hand),
          chosenCard = playableCards[0];
      return new Promise(function (resolve, reject) {
        if (chosenCard) {
          resolve(chosenCard);
        } else {
          reject();
        }
      });
    }

  }

  var game, reporter;

  beforeEach(function () {
    game = new Game({
      players: [
        new TestComputer(),
        new TestComputer()
      ]
    });
    reporter = new Reporter(game);
  });

  //it('emits message events', function (done) {
  //  reporter.on('reporter:message', function (message) {
  //    if (typeof message === 'object') {
  //      message = message.message;
  //    }
  //    if (message.length > 4 &&
  //        message.lastIndexOf('lost') === message.length - 4) {
  //      done();
  //    }
  //  });
  //  game.start();
  //});

});
