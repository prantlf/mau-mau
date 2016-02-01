import {expect} from 'chai';
import AverageComputer from '../../../node/engine/players/AverageComputer';
import Game from '../../../node/engine/game/Game';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

// Avoid checking the describe() for maximum statements
/*eslint max-statements: [2, 16]*/ 

describe('Average computer', function () {
  
  var game, player;

  it('requests drawing a card, if no card can be played', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.bells, Ranks.eight)
    ]).catch(function () {
      done();
    });
  });
  
  it('plays a playable card', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.hearts, Ranks.eight)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      expect(game.rules.chosenSuit).to.be.not.ok;
      done();
    });
  });
  
  it('chooses suit if queen is played', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.bells, Ranks.eight),
      new Card(Suits.acorns, Ranks.queen)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      expect(game.rules.chosenSuit).to.be.equal(
        player.hand.cards[0].suit);
      done();
    });
  });
  
  it('does not choose suit if the last queen is played', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.bells, Ranks.queen)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      expect(game.rules.chosenSuit).to.be.not.ok;
      done();
    });
  });

  it('prefers playing seven', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.hearts, Ranks.eight),
      new Card(Suits.bells, Ranks.seven)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      done();
    });
  });

  it('prefers playing ace', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.eight),
      new Card(Suits.hearts, Ranks.ace)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      done();
    });
  });

  it('prefers playing seven to playing ace', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.hearts, Ranks.ace),
      new Card(Suits.bells, Ranks.seven)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      done();
    });
  });

  it('does not play queen, when not needed', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.eight),
      new Card(Suits.acorns, Ranks.queen)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      done();
    });
  });

  it('when playing a queen, prefers the suit of a seven', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.nine),
      new Card(Suits.acorns, Ranks.queen),
      new Card(Suits.acorns, Ranks.seven)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      expect(game.rules.chosenSuit).to.be.equal(
        player.hand.cards[2].suit);
      done();
    });
  });

  it('when playing a queen, prefers the suit of a seven over an ace',
    function (done) {
      testChooseCard(new Card(Suits.hearts, Ranks.eight), [
        new Card(Suits.bells, Ranks.ace),
        new Card(Suits.acorns, Ranks.queen),
        new Card(Suits.acorns, Ranks.seven)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        expect(game.rules.chosenSuit).to.be.equal(
          player.hand.cards[2].suit);
        done();
      });
    });

  it('when playing a queen, prefers the suit of an ace', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.nine),
      new Card(Suits.acorns, Ranks.queen),
      new Card(Suits.bells, Ranks.ace)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[1]);
      expect(game.rules.chosenSuit).to.be.equal(
        player.hand.cards[2].suit);
      done();
    });
  });

  it('when playing a queen, prefers the suit of a non-queen',
    function (done) {
      testChooseCard(new Card(Suits.hearts, Ranks.eight), [
        new Card(Suits.bells, Ranks.nine),
        new Card(Suits.bells, Ranks.queen),
        new Card(Suits.acorns, Ranks.queen)
      ]).then(function (card) {
        expect(card.rank).to.be.equal(Ranks.queen);
        expect(game.rules.chosenSuit).to.be.equal(Suits.bells);
        done();
      });
    });

  it('when another queen remains, it still wishes its suit', function (done) {
    testChooseCard(new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.queen),
      new Card(Suits.acorns, Ranks.queen)
    ]).then(function (card) {
      var otherCard = card === player.hand.cards[0] ?
        player.hand.cards[1] : player.hand.cards[0];
      expect(card.rank).to.be.equal(Ranks.queen);
      expect(game.rules.chosenSuit).to.be.equal(otherCard.suit);
      done();
    });
  });

  it('can print its name', function () {
    expect(player.toString()).to.match(/^average computer\d+$/);
  });

  function testChooseCard(topCard, handCards) {
    game = new Game({
      players: [new AverageComputer()]
    }),
    player = game.players[0];
    game.playingStack.cards = [topCard];
    player.hand.cards = handCards;
    return player.chooseCard();
  }

});
