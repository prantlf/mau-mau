import {expect} from 'chai';
import Human from '../../../node/engine/players/Human';
import Card from '../../../node/engine/cards/Card';
import Suits from '../../../node/engine/cards/Suits';
import Ranks from '../../../node/engine/cards/Ranks';

describe('Human', function () {
  
  class TestGame {

    constructor() {
      this.cardToChoose = new Card(Suits.hearts, Ranks.seven);
    } 
     
    chooseCard(player) {
      this.choosingPlayer = player;
      return this.cardToChoose;
    }
    
  }
  
  var game, player;
  
  beforeEach(function () {
    game = new TestGame();
    player = new Human();
    player.attachGame(game);
  });
  
  it('chooses a card to play with the help of the game', function () {
    var card = player.chooseCard();
    expect(game.choosingPlayer).to.be.equal(player);
    expect(game.cardToChoose).to.be.equal(card);
  });
  
  it('can print its name', function () {
    expect(player.toString()).to.match(/^human\d+$/);
  });
  
  it('gets a unique name', function () {
    var otherPlayer = new Human();
    expect(player.toString()).to.be.not.equal(otherPlayer.toString());
  });

});
