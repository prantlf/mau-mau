import {expect} from 'chai';
import Pack from '../../../node/engine/cards/Pack';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Card pack', function () {
  
  it('starts empty', function () {
    var pack = new Pack();
    expect(pack.cards).to.be.empty;
    expect(pack.cardCount).to.be.equal(0);
  });
  
  it('when empty, nothing can be drawn', function () {
    var pack = new Pack();
    var drawnCards = pack.drawAllCards();
    expect(drawnCards).to.be.empty;
  });
  
  it('if empty, no event is emitted, when drawing a card', function () {
    var pack = new Pack(),
        emitted;
    pack.on('cards:dropped', function (drawnCards) {
      emitted = true;
    });
    pack.drawAllCards();
    expect(emitted).to.be.not.ok;
  });

  it('can contain cards', function () {
    var pack = new Pack();
    pack.cards = [
      new Card(Suits.hearts, Ranks.seven),
      new Card(Suits.bells, Ranks.eight)
    ];
    expect(pack.cardCount).to.be.equal(2);
  });
  
  it('allows drawing all cards', function () {
    var pack = new Pack(),
        cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ];
    pack.cards = cards.slice();
    var drawnCards = pack.drawAllCards();
    expect(pack.cards).to.be.empty;
    expect(pack.cardCount).to.be.equal(0);
    expect(drawnCards).to.have.length(cards.length);
    expect(drawnCards).to.have.members(cards);
  });
  
  it('emits an event about drawing all cards', function () {
    var pack = new Pack(),
        cards = [
          new Card(Suits.hearts, Ranks.seven),
          new Card(Suits.bells, Ranks.eight)
        ],
        emitted;
    pack.cards = cards.slice();
    pack.on('cards:dropped', function (drawnCards) {
      emitted = true;
      expect(drawnCards).to.have.length(cards.length);
      expect(drawnCards).to.have.members(cards);
    });
    pack.drawAllCards();
    expect(emitted).to.be.ok;
  });
  
});
