'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ranks = require('./../cards/Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _EventEmitter2 = require('./../misc/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Implements Czech rules.

var Rules = function (_EventEmitter) {
  _inherits(Rules, _EventEmitter);

  function Rules() {
    _classCallCheck(this, Rules);

    return _possibleConstructorReturn(this, (Rules.__proto__ || Object.getPrototypeOf(Rules)).apply(this, arguments));
  }

  _createClass(Rules, [{
    key: 'attachGame',
    value: function attachGame(game) {
      this.game = game;
      this.lastTopCard = null;
      this.chosenSuit = null;
    }
  }, {
    key: 'nextTurn',
    value: function nextTurn() {
      this.emit('rule:take-turn');
      if (letTopCardAffectPlayer.call(this)) {
        return letPlayerPlay.call(this);
      }
      return Promise.resolve();
    }
  }, {
    key: 'whoWins',
    value: function whoWins() {
      return this.game.activePlayers.find(function (player) {
        return player.hand.cardCount === 0;
      });
    }
  }, {
    key: 'pickPlayableCards',
    value: function pickPlayableCards(hand) {
      var topCard = this.game.playingStack.peekAtTopCard(),
          chosenSuit = this.chosenSuit || topCard.suit;
      return hand.pickCards(function (card) {
        return card.suit === chosenSuit || card.rank === topCard.rank || card.rank === _Ranks2.default.queen;
      });
    }
  }, {
    key: 'pickPlayableCardsForSuit',
    value: function pickPlayableCardsForSuit(cards, suit) {
      return cards.filter(function (card) {
        return card.suit === suit || card.rank === _Ranks2.default.queen;
      });
    }
  }, {
    key: 'defaultCardsPerPlayer',
    get: function get() {
      return 4;
    }
  }, {
    key: 'defaultPlayersPerPack',
    get: function get() {
      return 5;
    }
  }, {
    key: 'defaultContinueToEnd',
    get: function get() {
      return true;
    }
  }]);

  return Rules;
}(_EventEmitter3.default);

function letTopCardAffectPlayer() {
  var topCard = checkNewTopCard.call(this);
  // The top card on the playing stack affects the current
  // player only once, first when it turns up there
  if (topCard) {
    // Discard the forced suit first, when the queen is covered
    // by other card on the playing stack
    if (topCard.rank !== _Ranks2.default.queen) {
      this.chosenSuit = null;
    }

    // Aces stops the current player from playing
    if (topCard.rank === _Ranks2.default.ace) {
      this.emit('rule:pause');
      return false;
    }

    // Seven forces the current player to take two cards
    if (topCard.rank === _Ranks2.default.seven) {
      drawTwoCards.call(this);
      return false;
    }
  }

  return true;
}

function checkNewTopCard() {
  var topCard = this.game.playingStack.peekAtTopCard();
  // The top card on the playing stack affects the current
  // player only once, first when it turns up there
  if (topCard !== this.lastTopCard) {
    return this.lastTopCard = topCard;
  }
}

function drawTwoCards() {
  var player = this.game.currentPlayer;
  this.emit('rule:take-two');
  player.drawCard();
  player.drawCard();
}

function letPlayerPlay() {
  var player = this.game.currentPlayer;
  return player.playCard().then(undefined, function () {
    player.drawCard();
  });
}

exports.default = Rules;
//# sourceMappingURL=Rules.js.map
