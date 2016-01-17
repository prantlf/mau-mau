import Hand from './Hand';
import EventEmitter from './../misc/EventEmitter';

class Player extends EventEmitter {
  
  constructor() {
    super();

    this.hand = new Hand();
  }

  attachGame(game) {
    this.game = game;
  }

  drawCard() {
    var card = this.game.drawCard();
    this.hand.takeCard(card);
    this.emit('player:drawn', card);
  }

  playCard() {
    return this.chooseCard().then(
      card => {
        this.hand.dropCard(card);
        this.game.playCard(card);
        this.emit('player:played', card);
      });
  }
  
}

export default Player;
