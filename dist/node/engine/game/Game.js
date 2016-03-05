'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Deck = require('./../cards/Deck');

var _Deck2 = _interopRequireDefault(_Deck);

var _DrawingStack = require('./DrawingStack');

var _DrawingStack2 = _interopRequireDefault(_DrawingStack);

var _PlayingStack = require('./PlayingStack');

var _PlayingStack2 = _interopRequireDefault(_PlayingStack);

var _Rules = require('./Rules');

var _Rules2 = _interopRequireDefault(_Rules);

var _EventEmitter2 = require('./../misc/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Puts a game together; shuffles the cards and tells the players to play.

var Game = function (_EventEmitter) {
  _inherits(Game, _EventEmitter);

  function Game(options) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Game).call(this));

    options || (options = {});

    initializeRules.call(_this, options);
    initializePlayers.call(_this, options);
    initializeDeck.call(_this, options);
    initializePrompt.call(_this, options);

    _this.drawingStack.on('cards:dropped', checkForStacksTurnOver.bind(_this));
    return _this;
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
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
  }, {
    key: 'chooseCard',
    value: function chooseCard(player) {
      return this.prompt.chooseCard(player);
    }
  }, {
    key: 'drawCard',
    value: function drawCard() {
      if (this.drawingStack.cardCount === 0) {
        this.emit('game:cannot-draw-cards');
      }
      return this.drawingStack.drawCardFromTop();
    }
  }, {
    key: 'playCard',
    value: function playCard(card) {
      this.playingStack.putCardOnTop(card);
    }
  }, {
    key: 'nextGame',
    value: function nextGame() {
      var _this2 = this;

      this.deck.removeAllListeners();
      this.drawingStack.removeAllListeners();
      this.playingStack.removeAllListeners();
      this.rules.removeAllListeners();
      this.removeAllListeners();
      this.players.forEach(function (player) {
        return player.hand.removeAllListeners();
      });

      this.deck.putCardsToBottom(this.drawingStack.drawAllCards());
      this.deck.putCardsToBottom(this.playingStack.drawAllCards());
      this.players.forEach(function (player) {
        return _this2.deck.putCardsToBottom(player.hand.drawAllCards());
      });

      return new (this.constructor({
        players: this.players,
        deck: this.deck,
        rules: this.rules,
        prompt: this.prompt,
        cardsPerPlayer: this.cardsPerPlayer,
        playersPerPack: this.playersPerPack
      }))();
    }
  }, {
    key: 'currentPlayer',
    get: function get() {
      return this.activePlayers[this.currentPlayerIndex];
    }
  }]);

  return Game;
}(_EventEmitter3.default);

function initializeRules(options) {
  this.rules = options.rules || new _Rules2.default();
  this.rules.attachGame(this);
  this.cardsPerPlayer = options.cardsPerPlayer || this.rules.defaultCardsPerPlayer;
  this.playersPerPack = options.playersPerPack || this.rules.defaultPlayersPerPack;
  this.continueToEnd = options.continueToEnd !== undefined ? options.continueToEnd : this.rules.defaultContinueToEnd;
}

function initializePlayers(options) {
  var _this3 = this;

  this.players = [];
  if (options.players) {
    options.players.forEach(function (player) {
      _this3.players.push(player);
      player.attachGame(_this3);
    });
  }
  this.activePlayers = this.players.slice();
  this.currentPlayerIndex = 0;
  this.firstWinner = undefined;
}

function initializeDeck(options) {
  this.deck = options.deck || new _Deck2.default();
  // If the caller did not pass its own deck, use an additional
  // pack of cards for every 4 players by default
  if (!options.deck) {
    var extraPacks = Math.trunc((this.players.length - 1) / this.playersPerPack);
    while (--extraPacks >= 0) {
      this.deck.putCardsToBottom(new _Deck2.default().drawAllCards());
    }
  }
  this.drawingStack = new _DrawingStack2.default();
  this.playingStack = new _PlayingStack2.default();
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
    var usedCards = this.playingStack.drawAllCards(),
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
  var _this4 = this;

  this.rules.nextTurn().then(function () {
    if (checkPartialWinner.call(_this4)) {
      advanceFromPartialWinner.call(_this4);
    } else {
      advanceToOtherPlayer.call(_this4);
    }
    if (_this4.activePlayers.length === 1 || _this4.firstWinner && !_this4.continueToEnd) {
      // No change in this game as soon as the one but last player wins
      Object.freeze(_this4);
      _this4.emit('game:finished', _this4.firstWinner);
    } else {
      setTimeout(nextTurn.bind(_this4), 0);
      _this4.emit('game:next-turn');
    }
  }).catch(function (error) {
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
exports.default = Game;
//# sourceMappingURL=Game.js.map
