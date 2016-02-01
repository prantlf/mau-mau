import {expect} from 'chai';
import Player from '../../../node/engine/players/Player';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Player', function () {
  
  class TestGame {

    constructor() {
      this.cards = [new Card(Suits.hearts, Ranks.seven)];
      this.drawnCards = [];
      this.playedCards = [];
    } 
     
    drawCard() {
      var card = this.cards.shift();
      if (card) {
        this.drawnCards.push(card);
        return card;
      }
    }
  
    playCard(card) {
      this.playedCards.push(card);
    }
    
  }
  
  class TestPlayer extends Player {

    constructor() {
      super();
      this.hand.takeCard(new Card(Suits.bells, Ranks.eight));
    } 
     
    chooseCard() {
      return new Promise(function (resolve, reject) {
        if (this.hand.cardCount) {
          resolve(this.hand.cards[0]);
        } else {
          reject();
        }
      });
    }
    
  }
  
  var game, player;
  
  beforeEach(function () {
    game = new TestGame();
    player = new TestPlayer();
    player.attachGame(game);
  });
  
  it('draws a card with the help of the game', function () {
    var ownedCards = player.hand.cards.slice(),
        drawnCard;
    player.on('player:drawn', function (card) {
      drawnCard = card;
    });
    player.drawCard();
    expect(game.playedCards).to.have.length(0);
    expect(game.drawnCards).to.have.length(1);
    expect(drawnCard).to.be.equal(game.drawnCards[0]);
    expect(player.hand.cardCount).to.be.equal(2);
    expect(player.hand.cards).to.have.members(ownedCards.concat(drawnCard));
  });
  
  it('no event is emitted if no card can be drawn', function () {
    player.drawCard();
    var emitted;
    player.on('player:drawn', function (card) {
      emitted = true;
    });
    player.drawCard();
    expect(emitted).to.be.not.ok;
    expect(player.hand.cardCount).to.be.equal(2);
  });
  
  it('plays the chosen card with the help of the game', function () {
    var playedCard;
    player.on('player:played', function (card) {
      playedCard = card;
    });
    var resolved;
    player
        .playCard()
        .then(
          function (card) {
            resolved = true;
            expect(game.drawnCards).to.have.length(0);
            expect(game.playedCards).to.have.length(1);
            expect(playedCard).to.be.equal(card);
            expect(playedCard).to.be.equal(game.playedCards[0]);
            expect(player.hand.cardCount).to.be.equal(0);
          },
          function () {
            expect(false).to.be.ok;
          });
    setTimeout(function () {
      expect(resolved).to.be.ok;
    }, 1);
  });
  
  it('requests drawing a card, if no card can be played', function () {
    var rejected;
    player
        .playCard()
        .then(function () {
          var emitted;
          player.on('player:played', function (card) {
            emitted = true;
          });
          player
              .playCard()
              .then(
                function () {
                  expect(false).to.be.ok;
                },
                function () {
                  rejected = true;
                  expect(emitted).to.be.not.ok;
                });
        });
    setTimeout(function () {
      expect(rejected).to.be.ok;
    }, 1);
  });

});
