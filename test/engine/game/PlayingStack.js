import {expect} from 'chai';
import PlayingStack from '../../../node/engine/game/PlayingStack';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Playing stack', function () {
  
  var playingStack;
  
  beforeEach(function () {
    playingStack = new PlayingStack();
  });
  
  it('peeking a the top reveals nothing, when empty', function () {
    var peekedAtCard = playingStack.peekAtTopCard();
    expect(peekedAtCard).to.be.an('undefined');
  });
  
  it('lets peek at the card at the top', function () {
    var cards = [
      new Card(Suits.hearts, Ranks.seven),
      new Card(Suits.bells, Ranks.eight)
    ];
    playingStack.cards = cards.slice();
    var peekedAtCard = playingStack.peekAtTopCard();
    expect(peekedAtCard).to.be.equal(cards[0]);
  });
  
  it('lets put a card on the top', function () {
    var initialCards = [new Card(Suits.hearts, Ranks.seven)],
        additionalCard = new Card(Suits.bells, Ranks.eight);
    playingStack.cards = initialCards.slice();
    playingStack.putCardOnTop(additionalCard);
    expect(playingStack.cards).to.have.length(2);
    expect(playingStack.cards[0]).to.be.equal(additionalCard);
    expect(playingStack.cards[1]).to.be.equal(initialCards[0]);
    expect(playingStack.cardCount).to.be.equal(2);
  });
  
  it('emits an event about putting a card', function () {
    var initialCards = [new Card(Suits.hearts, Ranks.seven)],
        additionalCard = new Card(Suits.bells, Ranks.eight),
        emitted;
    playingStack.cards = initialCards.slice();
    playingStack.on('cards:received', function (putCards) {
      emitted = true;
      expect(putCards).to.have.length(1);
      expect(putCards).to.have.members([additionalCard]);
    });
    playingStack.putCardOnTop(additionalCard);
    expect(emitted).to.be.ok;
  });
  
  it('can print its name', function () {
    expect(playingStack.toString()).to.be.equal('playing stack');
  });

});
