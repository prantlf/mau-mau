import {expect} from 'chai';
import Stack from '../../../node/engine/cards/Stack';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Card stack', function () {
  
  var stack;
  
  beforeEach(function () {
    stack = new Stack();
  });
  
  it('allows putting cards to the bottom', function () {
    var initialCards = [
          new Card(Suits.hearts, Ranks.seven)
        ],
        additionalCards = [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.acorns, Ranks.nine)
        ];
    stack.cards = initialCards.slice();
    stack.putCardsToBottom(additionalCards);
    expect(stack.cards).to.have.length(3);
    expect(stack.cards[0]).to.be.equal(initialCards[0]);
    expect(stack.cards[1]).to.be.equal(additionalCards[0]);
    expect(stack.cards[2]).to.be.equal(additionalCards[1]);
    expect(stack.cardCount).to.be.equal(3);
  });
  
  it('emits an event about putting a card', function () {
    var initialCards = [
          new Card(Suits.hearts, Ranks.seven)
        ],
        additionalCards = [
          new Card(Suits.bells, Ranks.eight),
          new Card(Suits.acorns, Ranks.nine)
        ],
        emitted;
    stack.cards = initialCards.slice();
    stack.on('cards:received', function (putCards) {
      emitted = true;
      expect(putCards).to.have.length(2);
      expect(putCards).to.have.members([additionalCards[0],
        additionalCards[1]]);
    });
    stack.putCardsToBottom(additionalCards);
    expect(emitted).to.be.ok;
  });
  
});
