import {expect} from 'chai';
import SmartComputer from '../../../node/engine/players/SmartComputer';
import Game from '../../../node/engine/game/Game';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

// Avoid checking the describe() for maximum nested callbacks
/*eslint max-nested-callbacks: [2, 4]*/ 
// Avoid checking the describe() for maximum statements
/*eslint max-statements: [2, 13]*/ 

describe('Smart computer', function () {
  
  var game, player;

  it('requests drawing a card, if no card can be played', function (done) {
    testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.bells, Ranks.eight)
    ]).catch(function () {
      done();
    });
  });
  
  it('plays a playable card', function (done) {
    testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.hearts, Ranks.eight)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      expect(game.rules.chosenSuit).to.be.not.ok;
      done();
    });
  });
  
  it('chooses suit if queen is played', function (done) {
    testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
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
    testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
      new Card(Suits.bells, Ranks.queen)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      expect(game.rules.chosenSuit).to.be.not.ok;
      done();
    });
  });

  describe('when two players are playing', function (done) {
  
    it('avoids playing seven, if he has no card to cover it', function () {
      testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.hearts, Ranks.eight),
        new Card(Suits.bells, Ranks.seven)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[0]);
        done();
      });
    });

    it('prefers playing seven, if he has a card to cover it',
      function (done) {
        testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.bells, Ranks.seven)
        ]).then(function (card) {
          expect(card).to.be.equal(player.hand.cards[1]);
          done();
        });
      });

    it('chooses that seven, which allows shedding more cards',
      function (done) {
        testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.acorns, Ranks.seven),
          new Card(Suits.bells, Ranks.seven)
        ]).then(function (card) {
          expect(card).to.be.equal(player.hand.cards[1]);
          done();
        });
      });

    it('chooses that seven, which allows shedding more cards, with ace',
        function (done) {
          testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
            new Card(Suits.bells, Ranks.eight),
            new Card(Suits.acorns, Ranks.seven),
            new Card(Suits.bells, Ranks.ace),
            new Card(Suits.bells, Ranks.seven)
          ]).then(function (card) {
            expect(card).to.be.equal(player.hand.cards[1]);
            done();
          });
        });

    it('still plays seven, if he has no other card to play', function (done) {
      testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.bells, Ranks.eight),
        new Card(Suits.acorns, Ranks.seven)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        done();
      });
    });

    it('avoids playing ace, if he has no card to cover it', function (done) {
      testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.hearts, Ranks.eight),
        new Card(Suits.bells, Ranks.ace)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[0]);
        done();
      });
    });

    it('prefers playing ace, if he has a card to cover it', function (done) {
      testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.hearts, Ranks.eight),
        new Card(Suits.hearts, Ranks.ace)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        done();
      });
    });

    it('prefers playing that ace, which has a cover-card',
      function (done) {
        testChooseCard(2, new Card(Suits.hearts, Ranks.ace), [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.acorns, Ranks.ace),
          new Card(Suits.bells, Ranks.ace)
        ]).then(function (card) {
          expect(card).to.be.equal(player.hand.cards[1]);
          done();
        });
      });

    it('chooses that ace, which allows shedding more cards', function (done) {
      testChooseCard(3, new Card(Suits.hearts, Ranks.ace), [
        new Card(Suits.bells, Ranks.eight),
        new Card(Suits.bells, Ranks.ace),
        new Card(Suits.acorns, Ranks.ace)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[2]);
        done();
      });
    });

    it('chooses that ace, which allows shedding more cards, with seven',
      function (done) {
        testChooseCard(3, new Card(Suits.hearts, Ranks.ace), [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.bells, Ranks.ace),
          new Card(Suits.bells, Ranks.seven),
          new Card(Suits.acorns, Ranks.ace),
          new Card(Suits.acorns, Ranks.eight)
        ]).then(function (card) {
          expect(card).to.be.equal(player.hand.cards[3]);
          done();
        });
      });

    it('still plays ace, if he has no other card to play', function (done) {
      testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.bells, Ranks.eight),
        new Card(Suits.hearts, Ranks.ace)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        done();
      });
    });

    it('prefers playing ace over seven, if he has a card to cover it',
      function (done) {
        testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
          new Card(Suits.hearts, Ranks.eight),
          new Card(Suits.hearts, Ranks.ace),
          new Card(Suits.acorns, Ranks.seven)
        ]).then(function (card) {
          expect(card).to.be.equal(player.hand.cards[1]);
          done();
        });
      });

  });

  describe('when more than two players are playing', function () {

    it('always prefers playing seven', function (done) {
      testChooseCard(3, new Card(Suits.hearts, Ranks.seven), [
        new Card(Suits.hearts, Ranks.eight),
        new Card(Suits.bells, Ranks.seven)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        done();
      });
    });

    it('always prefers playing ace', function (done) {
      testChooseCard(3, new Card(Suits.hearts, Ranks.eight), [
        new Card(Suits.bells, Ranks.eight),
        new Card(Suits.hearts, Ranks.ace)
      ]).then(function (card) {
        expect(card).to.be.equal(player.hand.cards[1]);
        done();
      });
    });

  });

  it('chooses randomly among cards, which allow shedding the same card count',
    function (done) {
      var resolved = 0,
          promises = [...Array(5).keys()].map(function () {
            return testChooseCard(2, new Card(Suits.hearts, Ranks.seven), [
              new Card(Suits.bells, Ranks.eight),
              new Card(Suits.hearts, Ranks.ace),
              new Card(Suits.hearts, Ranks.eight),
              new Card(Suits.bells, Ranks.seven)
            ]).then(function (card) {
              ++resolved;
              return player.hand.cards.indexOf(card);
            });
          });
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

  it('does not play queen, when not needed', function (done) {
    testChooseCard(3, new Card(Suits.hearts, Ranks.eight), [
      new Card(Suits.bells, Ranks.eight),
      new Card(Suits.acorns, Ranks.queen)
    ]).then(function (card) {
      expect(card).to.be.equal(player.hand.cards[0]);
      done();
    });
  });

  it('when playing a queen, prefers the suit of other card',
    function (done) {
      testChooseCard(2, new Card(Suits.hearts, Ranks.eight), [
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
    testChooseCard(2, new Card(Suits.hearts, Ranks.eight), [
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
    expect(player.toString()).to.match(/^smart computer\d+$/);
  });

  function testChooseCard(playerCount, topCard, handCards) {
    var players = [...Array(playerCount).keys()].map(function () {
      return new SmartComputer();
    });
    game = new Game({
      players: players
    }),
    player = game.players[0];
    game.playingStack.cards = [topCard];
    player.hand.cards = handCards;
    return player.chooseCard();
  }

});
