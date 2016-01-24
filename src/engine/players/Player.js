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
    // If the count of card decks is not balanced well with the count of
    // players and the cards they are initially dealt, the drawing stack
    // can run out of cards.
    if (card) {
      this.hand.takeCard(card);
      this.emit('player:drawn', card);
    }
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
