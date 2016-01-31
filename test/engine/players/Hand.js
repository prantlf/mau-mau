import {expect} from 'chai';
import Hand from '../../../node/engine/players/Hand';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Hand of cards', function () {
  
  var hand;
  
  beforeEach(function () {
    hand = new Hand();
  });
  
  it('if empty, no event is emitted, when dropping a card', function () {
    var card = new Card(Suits.hearts, Ranks.seven),
        emitted;
    hand.on('cards:dropped', function (droppedCards) {
      emitted = true;
    });
    hand.dropCard(card),
    expect(emitted).to.be.not.ok;
  });
  
  it('no event is emitted, when dropping a card not in hand', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven)
        ],
        otherCard = new Card(Suits.bells, Ranks.eight),
        emitted;
    hand.cards = cards.slice();
    hand.on('cards:dropped', function (droppedCards) {
      emitted = true;
    });
    hand.dropCard(otherCard),
    expect(emitted).to.be.not.ok;
  });
  
  it('allows dropping a card', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        emitted;
    hand.cards = cards.slice();
    hand.on('cards:dropped', function (droppedCards) {
      emitted = true;
      expect(droppedCards).to.have.length(1);
      expect(droppedCards).to.have.members([cards[0]]);
    });
    hand.dropCard(cards[0]);
    expect(hand.cards).to.have.length(1);
    expect(hand.cards).to.have.members([cards[1]]);
    expect(emitted).to.be.ok;
  });
  
  it('allows taking a card', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven)
        ],
        otherCard = new Card(Suits.bells, Ranks.eight),
        emitted;
    hand.cards = cards.slice();
    hand.on('cards:received', function (receivedCards) {
      emitted = true;
      expect(receivedCards).to.have.length(1);
      expect(receivedCards).to.have.members([otherCard]);
    });
    hand.takeCard(otherCard),
    expect(hand.cards).to.have.length(2);
    expect(hand.cards).to.have.members([cards[0], otherCard]);
    expect(emitted).to.be.ok;
  });
  
  it('allows picking nothing, if the hand is empty', function () {
    var picked = hand.pickCards();
    expect(picked).to.have.length(0);
  });

  it('allows picking all cards', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        picked;
    hand.cards = cards.slice();
    picked = hand.pickCards();
    expect(hand.cards).to.have.length(2);
    expect(hand.cards).to.have.members([cards[0], cards[1]]);
  });
  
  it('allows picking some cards', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        picked;
    hand.cards = cards.slice();
    picked = hand.pickCards(function (card) {
      return card.suit === Suits.hearts;
    });
    expect(picked).to.have.length(1);
    expect(picked).to.have.members([cards[0]]);
  });

  it('allows picking no cards', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        picked;
    hand.cards = cards.slice();
    picked = hand.pickCards(function (card) {
      return card.suit === Suits.acorns;
    });
    expect(picked).to.have.length(0);
  });

});
