import {expect} from 'chai';
import DummyComputer from '../../../node/engine/players/DummyComputer';
import Game from '../../../node/engine/game/Game';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

// Avoid checking the describe() for maximum nested callbacks
/*eslint max-nested-callbacks: [2, 4]*/ 

describe('Dummy computer', function () {
  
  var game, player;
  
  beforeEach(function () {
    player = new DummyComputer();
    game = new Game({
      players: [player]
    });
  });
  
  it('requests drawing a card, if no card can be played', function (done) {
    game.playingStack.cards = [new Card(Suits.bells, Ranks.eight)];
    player.hand.cards = [new Card(Suits.acorns, Ranks.nine)];
    player
        .chooseCard()
        .catch(function () {
          done();
        });
  });
  
  it('plays a playable card', function (done) {
    game.playingStack.cards = [new Card(Suits.bells, Ranks.eight)];
    player.hand.cards = [new Card(Suits.acorns, Ranks.eight)];
    player
        .chooseCard()
        .then(function (card) {
          expect(card).to.be.equal(player.hand.cards[0]);
          expect(game.rules.chosenSuit).to.be.not.ok;
          done();
        });
  });
  
  it('chooses suit if queen is played', function (done) {
    game.playingStack.cards = [new Card(Suits.bells, Ranks.eight)];
    player.hand.cards = [
      new Card(Suits.acorns, Ranks.nine),
      new Card(Suits.leaves, Ranks.queen)
    ];
    player
        .chooseCard()
        .then(function (card) {
          expect(card).to.be.equal(player.hand.cards[1]);
          expect(game.rules.chosenSuit).to.be.equal(
            player.hand.cards[0].suit);
          done();
        });
  });
  
  it('does not choose suit if the last queen is played', function (done) {
    game.playingStack.cards = [new Card(Suits.bells, Ranks.eight)];
    player.hand.cards = [new Card(Suits.acorns, Ranks.queen)];
    player
        .chooseCard()
        .then(function (card) {
          expect(card).to.be.equal(player.hand.cards[0]);
          expect(game.rules.chosenSuit).to.be.not.ok;
          done();
        });
  });

  it('choose a random card from playable ones', function (done) {
    game.playingStack.cards = [new Card(Suits.bells, Ranks.eight)];
    player.hand.cards = [
      new Card(Suits.bells, Ranks.nine),
      new Card(Suits.acorns, Ranks.eight)
    ];
    var promises = [...Array(5).keys()].map(function () {
          return player
              .chooseCard()
              .then(function (card) {
                ++resolved;
                return player.hand.cards.indexOf(card);
              });
        }),
        resolved = 0;
    Promise
        .all(promises)
        .then(function (indexes) {
          expect(resolved).to.be.equal(promises.length);
          var differentIndexes = indexes.findIndex(function (index) {
            return indexes[0] !== index;
          });
          expect(differentIndexes >= 0).to.be.ok;
          done();
        });
  });
  
  it('can print its name', function () {
    expect(player.toString()).to.match(/^dummy computer\d+$/);
  });

});
