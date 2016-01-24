import {expect} from 'chai';
import Deck from '../../../node/engine/cards/Deck';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Card deck', function () {
  
  var deck;
  
  beforeEach(function () {
    deck = new Deck();
  });
  
  it('contains thirty-two cards', function () {
    expect(deck.cardCount).to.be.equal(32);
  });
  
  it('contains all suits', function () {
    var suits = {};
    suits[Suits.hearts] = 0;
    suits[Suits.bells] = 0;
    suits[Suits.acorns] = 0;
    suits[Suits.leaves] = 0;
    deck.drawAllCards().forEach(function (card) {
      expect(suits).to.have.property(card.suit);
      ++suits[card.suit];
    });
    Object.keys(suits).forEach(function (suit) {
      expect(suits[suit]).to.be.equal(8);
    });
  });
  
  it('contains all ranks', function () {
    var ranks = {};
    ranks[Ranks.seven] = 0;
    ranks[Ranks.eight] = 0;
    ranks[Ranks.nine] = 0;
    ranks[Ranks.ten] = 0;
    ranks[Ranks.jack] = 0;
    ranks[Ranks.queen] = 0;
    ranks[Ranks.king] = 0;
    ranks[Ranks.ace] = 0;
    deck.drawAllCards().forEach(function (card) {
      expect(ranks).to.have.property(card.rank);
      ++ranks[card.rank];
    });
    Object.keys(ranks).forEach(function (rank) {
      expect(ranks[rank]).to.be.equal(4);
    });
  });
  
});
