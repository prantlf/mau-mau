import {expect} from 'chai';
import Computer from '../../../node/engine/players/Computer';

describe('Computer', function () {
  
  var player;
  
  beforeEach(function () {
    player = new Computer();
  });
  
  it('can print its name', function () {
    expect(player.toString()).to.match(/^computer\d+$/);
  });
  
  it('gets a unique name', function () {
    var otherPlayer = new Computer();
    expect(player.toString()).to.be.not.equal(otherPlayer.toString());
  });

});
