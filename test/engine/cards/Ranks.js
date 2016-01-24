import {expect} from 'chai';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Ranks', function () {

  it('there are eight of them', function () {
    var ranks = Object.keys(Ranks);
    expect(ranks).to.have.length(8);
    expect(Ranks).to.have.property(Ranks.seven);
    expect(Ranks).to.have.property(Ranks.eight);
    expect(Ranks).to.have.property(Ranks.nine);
    expect(Ranks).to.have.property(Ranks.ten);
    expect(Ranks).to.have.property(Ranks.jack);
    expect(Ranks).to.have.property(Ranks.queen);
    expect(Ranks).to.have.property(Ranks.king);
    expect(Ranks).to.have.property(Ranks.ace);
  });

  it('cannot be modified', function () {
    expect(function () {
      Ranks.other = 'other';
    }).to.throw(TypeError);
  });
  
});
