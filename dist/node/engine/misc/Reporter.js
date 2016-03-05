'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ranks = require('../cards/Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _Deck = require('../cards/Deck');

var _Deck2 = _interopRequireDefault(_Deck);

var _Player = require('../players/Player');

var _Player2 = _interopRequireDefault(_Player);

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reporter = function (_EventEmitter) {
  _inherits(Reporter, _EventEmitter);

  function Reporter(game) {
    _classCallCheck(this, Reporter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Reporter).call(this));

    var gameStarted = false,
        drawsTwo = null;

    game.on('game:starting', function () {
      _this.emit('reporter:message', _i18n2.default.translate('$[1] players started with $[2] cards ($[3] card decks)', game.players.length, game.deck.cardCount, game.deck.cardCount / _Deck2.default.cardCount));
    }).on('game:started', function () {
      _this.emit('reporter:message', _i18n2.default.translate('each player was dealt $[1] cards', game.cardsPerPlayer) + ', ' + _i18n2.default.translate('$[1] is on playing stack', game.playingStack.peekAtTopCard()));
      gameStarted = true;
    }).on('game:turning-over', function () {
      _this.emit('reporter:message', 'Turning over the playing stack.');
    }).on('game:partial-win', function (winner) {
      var message = winner === game.firstWinner ? '$[1] won' : '$[1] shed all cards';
      _this.emit('reporter:message', {
        playerIndex: game.players.indexOf(winner),
        important: true,
        message: _i18n2.default.translate(message, winner)
      });
    }).on('game:finished', function (winner) {
      if (game.continueToEnd) {
        var loser = game.activePlayers[0];
        _this.emit('reporter:message', {
          playerIndex: game.players.indexOf(loser),
          important: true,
          message: _i18n2.default.translate('$[1] lost', loser)
        });
      }
    });

    game.players.forEach(function (player) {
      player.hand.on('cards:dropped', function (cards) {
        // Do not report cards the player was dealt
        if (gameStarted) {
          // Cards can be dropped just by one
          var card = cards[0],
              suit = card.rank === _Ranks2.default.queen && game.rules.chosenSuit ? _i18n2.default.translate(' and chose $[1]', _i18n2.default.translate(game.rules.chosenSuit)) : '';
          _this.emit('reporter:message', {
            playerIndex: game.players.indexOf(player),
            message: _i18n2.default.translate('$[1] played $[2]', player, card) + suit
          });
          // Cards can be drawn just by one; when another player plays,
          // reset the slot for the player who was taking two cards
          if (player !== drawsTwo) {
            drawsTwo = null;
          }
        }
      }).on('cards:received', function (cards) {
        // Do not report cards the player was dealt
        if (gameStarted) {
          // Do not report the two cards drawn when a seven was seen
          if (player !== drawsTwo) {
            _this.emit('reporter:message', {
              playerIndex: game.players.indexOf(player),
              message: _i18n2.default.translate('$[1] drew a card', player)
            });
            // Cards can be drawn just by one; when another player plays,
            // reset the slot for the player who was taking two cards
            drawsTwo = null;
          }
        }
      });
    });

    game.rules.on('rule:take-turn', function () {
      if (!game.activePlayers.indexOf(game.currentPlayer)) {
        _this.emit('reporter:message', {
          divider: true,
          message: '---'
        });
      }
    }).on('rule:pause', function () {
      var player = game.currentPlayer;
      _this.emit('reporter:message', {
        playerIndex: game.players.indexOf(player),
        message: _i18n2.default.translate('$[1] had to pause', player)
      });
    }).on('rule:take-two', function () {
      var player = game.currentPlayer;
      _this.emit('reporter:message', {
        playerIndex: game.players.indexOf(player),
        message: _i18n2.default.translate('$[1] had to draw two cards', player)
      });
      drawsTwo = player;
    });
    return _this;
  }

  return Reporter;
}(_EventEmitter3.default);

exports.default = Reporter;
//# sourceMappingURL=Reporter.js.map
