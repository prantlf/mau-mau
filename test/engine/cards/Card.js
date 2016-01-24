import {expect} from 'chai';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Card', function () {
  
  it('has suit and rank', function () {
    var card = new Card(Suits.hearts, Ranks.seven);
    expect(card).to.have.property('suit', Suits.hearts);
    expect(card).to.have.property('rank', Ranks.seven);
  });

  it('cannot be modified after creation', function () {
    var card = new Card(Suits.hearts, Ranks.seven);
    expect(function () {
      card.suit = Suits.bells;
    }).to.throw(TypeError);
    expect(function () {
      card.rank = Ranks.eight;
    }).to.throw(TypeError);
  });
  
  it('overrides toString', function () {
    var card = new Card(Suits.hearts, Ranks.seven);
    expect(card.toString()).to.be.equal('seven hearts');
  });

});
