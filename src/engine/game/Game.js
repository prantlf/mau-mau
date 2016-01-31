import Deck from './../cards/Deck';
import DrawingStack from './DrawingStack';
import PlayingStack from './PlayingStack';
import Rules from './Rules';
import EventEmitter from './../misc/EventEmitter';

// Puts a game together; shuffles the cards and tells the players to play.

class Game extends EventEmitter {

  constructor(options) {
    super();

    options || (options = {});

    initializeRules.call(this, options);
    initializePlayers.call(this, options);
    initializeDeck.call(this, options);
    initializePrompt.call(this, options);

    this.drawingStack.on('cards:dropped', checkForStacksTurnOver.bind(this));
  }

  get currentPlayer() {
    return this.activePlayers[this.currentPlayerIndex];
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
    if (this.drawingStack.cardCount === 0) {
      this.emit('game:cannot-draw-cards');
    }
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
      prompt: this.prompt,
      cardsPerPlayer: this.cardsPerPlayer,
      playersPerPack: this.playersPerPack
    }));
  }

}

function initializeRules(options) {
  this.rules = options.rules || new Rules();
  this.rules.attachGame(this);
  this.cardsPerPlayer = options.cardsPerPlayer ||
    this.rules.defaultCardsPerPlayer;
  this.playersPerPack = options.playersPerPack ||
    this.rules.defaultPlayersPerPack;
  this.continueToEnd = options.continueToEnd !== undefined ?
    options.continueToEnd : this.rules.defaultContinueToEnd;
}

function initializePlayers(options) {
  this.players = [];
  if (options.players) {
    options.players.forEach(player => {
      this.players.push(player);
      player.attachGame(this);
    });
  }
  this.activePlayers = this.players.slice();
  this.currentPlayerIndex = 0;
  this.firstWinner = undefined;
}

function initializeDeck(options) {
  this.deck = options.deck || new Deck();
  // If the caller did not pass its own deck, use an additional
  // pack of cards for every 4 players by default
  if (!options.deck) {
    let extraPacks = Math.trunc((this.players.length - 1) /
      this.playersPerPack);
    while (--extraPacks >= 0) {
      this.deck.putCardsToBottom(new Deck().drawAllCards());
    }
  }
  this.drawingStack = new DrawingStack();
  this.playingStack = new PlayingStack();
}

function initializePrompt(options) {
  if (options.prompt) {
    this.prompt = options.prompt;
    this.prompt.attachGame(this);
  }
}

function checkForStacksTurnOver() {
  if (this.drawingStack.cardCount === 0) {
    this.emit('game:turning-over');
    let usedCards = this.playingStack.drawAllCards(),
        topCard = usedCards.shift();
    shuffleCards.call(this, usedCards);
    this.drawingStack.putCardsToBottom(usedCards);
    this.playingStack.putCardOnTop(topCard);
    this.emit('game:turned-over');
  }
}

function advanceToOtherPlayer() {
  if (this.currentPlayerIndex < this.activePlayers.length - 1) {
    ++this.currentPlayerIndex;
  } else {
    this.currentPlayerIndex = 0;
  }
}

function advanceFromPartialWinner() {
  this.activePlayers.splice(this.currentPlayerIndex, 1);
  if (this.currentPlayerIndex === this.activePlayers.length) {
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
  // The cards are given to each player one by one, 4 by default
  var cardCount = this.cardsPerPlayer;
  while (--cardCount >= 0) {
    this.players.forEach(function (player) {
      player.drawCard();
    });
  }
}

function nextTurn() {
  this.rules.nextTurn()
      .then(() => {
        if (checkPartialWinner.call(this)) {
          advanceFromPartialWinner.call(this);
        } else {
          advanceToOtherPlayer.call(this);
        }
        if (this.activePlayers.length === 1 ||
            this.firstWinner && !this.continueToEnd) {
          // No change in this game as soon as the one but last player wins
          Object.freeze(this);
          this.emit('game:finished', this.firstWinner);
        } else {
          setTimeout(nextTurn.bind(this), 0);
          this.emit('game:next-turn');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

function checkPartialWinner() {
  var winner = this.rules.whoWins();
  if (winner) {
    if (!this.firstWinner) {
      this.firstWinner = winner;
    }
    this.emit('game:partial-win', winner);
    return true;
  }
}
export default Game;
