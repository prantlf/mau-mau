import {expect} from 'chai';
import Prompt from '../../../node/engine/game/Prompt';

describe('Prompt', function () {
  
  class TestGame {

    constructor(options) {
      options.prompt.attachGame(this);
    }
    
  }

  it('remembers its game', function () {
    var prompt = new Prompt(),
        game = new TestGame({
          prompt: prompt
        });
    expect(prompt.game).to.be.equal(game);
  });

});
