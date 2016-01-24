import {expect} from 'chai';
import Stack from '../../../node/engine/cards/Stack';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Card stack', function () {
  
  it('has the constructor for creation only', function () {
    new Stack();
    expect(function () {
      Stack();
    }).to.throw(TypeError);
  });
  
  it('when empty, nothing can be drawn', function () {
    var stack = new Stack();
    var drawnCard = stack.drawCardFromTop();
    expect(drawnCard).to.be.an('undefined');
  });
  
  it('if empty, no event is emitted, when drawing a card', function () {
    var stack = new Stack(),
        emitted;
    stack.on('cards:dropped', function (drawnCards) {
      emitted = true;
    });
    stack.drawCardFromTop(),
    expect(emitted).to.be.not.ok;
  });
  
  it('allows drawing a card from the top', function () {
    var stack = new Stack(),
        cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ];
    stack.cards = cards.slice();
    var drawnCard = stack.drawCardFromTop();
    expect(drawnCard).to.be.equal(cards[0]);
    expect(stack.cards).to.have.length(1);
    expect(stack.cards).to.have.members([cards[1]]);
    expect(stack.cardCount).to.be.equal(1);
  });
  
  it('emits an event about drawing a card', function () {
    var stack = new Stack(),
        cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        emitted;
    stack.cards = cards.slice();
    stack.on('cards:dropped', function (drawnCards) {
      emitted = true;
      expect(drawnCards).to.have.length(1);
      expect(drawnCards).to.have.members([cards[0]]);
    });
    stack.drawCardFromTop();
    expect(emitted).to.be.ok;
  });
  
  it('allows putting cards to the bottom', function () {
    var stack = new Stack(),
        initialCards = [
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
    var stack = new Stack(),
        initialCards = [
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
