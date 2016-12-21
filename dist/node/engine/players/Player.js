'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Hand = require('./Hand');

var _Hand2 = _interopRequireDefault(_Hand);

var _EventEmitter2 = require('./../misc/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_EventEmitter) {
  _inherits(Player, _EventEmitter);

  function Player() {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

    _this.hand = new _Hand2.default();
    return _this;
  }

  _createClass(Player, [{
    key: 'attachGame',
    value: function attachGame(game) {
      this.game = game;
    }
  }, {
    key: 'drawCard',
    value: function drawCard() {
      var card = this.game.drawCard();
      // If the count of card decks is not balanced well with the count of
      // players and the cards they are initially dealt, the drawing stack
      // can run out of cards.
      if (card) {
        this.hand.takeCard(card);
        this.emit('player:drawn', card);
      }
    }
  }, {
    key: 'playCard',
    value: function playCard() {
      var _this2 = this;

      return this.chooseCard().then(function (card) {
        _this2.hand.dropCard(card);
        _this2.game.playCard(card);
        _this2.emit('player:played', card);
      });
    }
  }]);

  return Player;
}(_EventEmitter3.default);

exports.default = Player;
//# sourceMappingURL=Player.js.map
