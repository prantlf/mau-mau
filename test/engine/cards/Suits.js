import {expect} from 'chai';
import Suits from '../../../node/engine/cards/Suits';

describe('Suits', function () {

  it('there are four of them', function () {
    var suits = Object.keys(Suits);
    expect(suits).to.have.length(4);
    expect(Suits).to.have.property(Suits.hearts);
    expect(Suits).to.have.property(Suits.bells);
    expect(Suits).to.have.property(Suits.acorns);
    expect(Suits).to.have.property(Suits.leaves);
  });

  it('cannot be modified', function () {
    expect(function () {
      Suits.other = 'other';
    }).to.throw(TypeError);
  });
  
});
