import Ranks from './../cards/Ranks';
import EventEmitter from './../misc/EventEmitter';

class Rules extends EventEmitter {

  attachGame(game) {
    this.game = game;
    this.lastTopCard = null;
    this.chosenSuit = null;
  }

  get cardsPerPlayer() {
    return 4;
  }

  get playersPerPack() {
    return 5;
  }

  nextTurn() {
    this.emit('rule:take-turn');
    if (letTopCardAffectPlayer.call(this)) {
      return letPlayerPlay.call(this);
    }
    return Promise.resolve();
  }

  whoWins() {
    return this.game.players.find(function (player) {
      return player.hand.cardCount === 0;
    });
  }

  pickPlayableCards(hand) {
    var topCard = this.game.playingStack.peekAtTopCard(),
        chosenSuit = this.chosenSuit || topCard.suit;
    return hand.pickCards(function (card) {
      return card.suit === chosenSuit ||
             card.rank === topCard.rank ||
             card.rank === Ranks.queen;
    });
  }

}

function letTopCardAffectPlayer() {
  var topCard = this.game.playingStack.peekAtTopCard();
  // The top card on the playing stack affects the current
  // player only once, first when it turns up there
  if (topCard === this.lastTopCard) {
    return true;
  }

  // Discard the forced suit first, when the queen is covered
  // by other card on the playing stack
  if (topCard.rank !== Ranks.queen) {
    this.chosenSuit = null;
  }
  this.lastTopCard = topCard;

  // Aces stops the current player from playing
  if (topCard.rank === Ranks.ace) {
    this.emit('rule:pause');
    return false;
  }

  // Seven forces the current player to take two cards
  if (topCard.rank === Ranks.seven) {
    let player = this.game.currentPlayer;
    this.emit('rule:take-two');
    player.drawCard();
    player.drawCard();
    return false;
  }

  return true;
}

function letPlayerPlay() {
  var player = this.game.currentPlayer;
  return player.playCard().then(
      undefined,
      function () {
        player.drawCard();
      });
}

export default Rules;
