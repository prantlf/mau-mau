import Deck from './../cards/Deck';
import DrawingStack from './DrawingStack';
import PlayingStack from './PlayingStack';
import Rules from './Rules';
import EventEmitter from './../misc/EventEmitter';

class Game extends EventEmitter {

  constructor(options) {
    super();

    options || (options = {});

    this.players = [];
    if (options.players) {
      options.players.forEach(player => {
        this.players.push(player);
        player.attachGame(this);
      });
    }
    this.currentPlayerIndex = 0;

    this.deck = options.deck || new Deck();
    this.drawingStack = new DrawingStack();
    this.playingStack = new PlayingStack();

    this.rules = options.rules || new Rules();
    this.rules.attachGame(this);
    // If the caller did not pass its own deck, use an additional
    // pack of cards for every 5 players
    if (!options.deck) {
      let extraPacks = Math.trunc(this.players.length /
                                  this.rules.playersPerPack);
      while (--extraPacks >= 0) {
        this.deck.putCardsToBottom(new Deck().drawAllCards());
      }
    }

    if (options.prompt) {
      this.prompt = options.prompt;
      this.prompt.attachGame(this);
    }

    this.drawingStack.on('cards:dropped', checkForStacksTurnOver.bind(this));
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  start() {
    this.emit('game:starting');
    var cards = this.deck.drawAllCards();
    shuffleCards.call(this, cards);
    this.drawingStack.putCardsToBottom(cards);
    dealCards.call(this);
    this.playingStack.putCardOnTop(this.drawingStack.drawCardFromTop());

    // No player can join or leave during the game 
    Object.freeze(this.players);

    setTimeout(nextTurn.bind(this), 0);
    this.emit('game:started');
  }

  chooseCard(player) {
    return this.prompt.chooseCard(player);
  }

  drawCard() {
    return this.drawingStack.drawCardFromTop();
  }

  playCard(card) {
    this.playingStack.putCardOnTop(card);
  }

  nextGame() {
    this.deck.removeAllListeners();
    this.drawingStack.removeAllListeners();
    this.playingStack.removeAllListeners();
    this.rules.removeAllListeners();
    this.removeAllListeners();
    this.players.forEach(player => player.hand.removeAllListeners());

    this.deck.putCardsToBottom(this.drawingStack.drawAllCards());
    this.deck.putCardsToBottom(this.playingStack.drawAllCards());
    this.players.forEach(player =>
        this.deck.putCardsToBottom(player.hand.drawAllCards()));

    return new (this.constructor({
      players: this.players,
      deck: this.deck,
      rules: this.rules,
      prompt: this.prompt
    }));
  }

}

function checkForStacksTurnOver() {
  if (this.drawingStack.cardCount === 0) {
    this.emit('game:turning-over');
    let topCard = this.playingStack.drawCardFromTop(),
        usedCards = this.playingStack.drawAllCards();
    shuffleCards.call(this, usedCards);
    this.drawingStack.putCardsToBottom(usedCards);
    this.playingStack.putCardOnTop(topCard);
    this.emit('game:turned-over');
  }
}

function advanceToOtherPlayer() {
  if (this.currentPlayerIndex < this.players.length - 1) {
    ++this.currentPlayerIndex;
  } else {
    this.currentPlayerIndex = 0;
  }
}

function shuffleCards(cards) {
  // Takes a card from the top and puts it at a random position
  // in the stack, al of this at least once the size of the stack
  var cardCount = cards.length,
      moveCount = Math.trunc(cardCount * (1 + Math.random()));
  while (--moveCount >= 0) {
    cards.splice(Math.trunc(cardCount * Math.random()), 0, cards.shift());
  }
}

function dealCards() {
  // The cards are given to each player one by one
  var cardCount = this.rules.cardsPerPlayer;
  while (--cardCount >= 0) {
    this.players.forEach(function (player) {
      player.drawCard();
    });
  }
}

function nextTurn() {
  this.rules.nextTurn()
      .then(() => {
        var winner = this.rules.whoWins();
        if (winner) {
          // No change in this game as soon as a player wins
          Object.freeze(this);
          this.emit('game:finished', winner);
        } else {
          advanceToOtherPlayer.call(this);
          setTimeout(nextTurn.bind(this), 0);
          this.emit('game:next-turn');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

export default Game;
