import {expect} from 'chai';
import DrawingStack from '../../../node/engine/game/DrawingStack';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Drawing stack', function () {
  
  var drawingStack;
  
  beforeEach(function () {
    drawingStack = new DrawingStack();
  });
  
  it('when empty, nothing can be drawn', function () {
    var drawnCard = drawingStack.drawCardFromTop();
    expect(drawnCard).to.be.an('undefined');
  });
  
  it('if empty, no event is emitted, when drawing a card', function () {
    var emitted;
    drawingStack.on('cards:dropped', function (drawnCards) {
      emitted = true;
    });
    drawingStack.drawCardFromTop(),
    expect(emitted).to.be.not.ok;
  });
  
  it('allows drawing a card from the top', function () {
    var cards = [
      new Card(Suits.hearts, Ranks.seven),
      new Card(Suits.bells, Ranks.eight)
    ];
    drawingStack.cards = cards.slice();
    var drawnCard = drawingStack.drawCardFromTop();
    expect(drawnCard).to.be.equal(cards[0]);
    expect(drawingStack.cards).to.have.length(1);
    expect(drawingStack.cards).to.have.members([cards[1]]);
    expect(drawingStack.cardCount).to.be.equal(1);
  });
  
  it('emits an event about drawing a card', function () {
    var cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        emitted;
    drawingStack.cards = cards.slice();
    drawingStack.on('cards:dropped', function (drawnCards) {
      emitted = true;
      expect(drawnCards).to.have.length(1);
      expect(drawnCards).to.have.members([cards[0]]);
    });
    drawingStack.drawCardFromTop();
    expect(emitted).to.be.ok;
  });
  
  it('can print its name', function () {
    expect(drawingStack.toString()).to.be.equal('drawing stack');
  });

});
