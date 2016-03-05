'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Computer2 = require('./Computer');

var _Computer3 = _interopRequireDefault(_Computer2);

var _Ranks = require('./../cards/Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _i18n = require('../misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Plays a random playable card from his hand.  If the card is a queen,
// he wishes the suit of a random remaining card in his hand.

var DummyComputer = function (_Computer) {
  _inherits(DummyComputer, _Computer);

  function DummyComputer() {
    _classCallCheck(this, DummyComputer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DummyComputer).apply(this, arguments));
  }

  _createClass(DummyComputer, [{
    key: 'chooseCard',
    value: function chooseCard() {
      var availableCards = this.hand.pickCards(),
          playableCards = this.game.rules.pickPlayableCards(this.hand),
          chosenCard = suggestCard.call(this, availableCards, playableCards);
      return new Promise(function (resolve, reject) {
        if (chosenCard) {
          resolve(chosenCard);
        } else {
          reject();
        }
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _i18n2.default.translate('dummy $[1]', _Computer3.default.prototype.toString.apply(this, arguments));
    }
  }]);

  return DummyComputer;
}(_Computer3.default);

function suggestCard(availableCards, playableCards) {
  // No playable card found will mean drawing a new one
  if (!playableCards.length) {
    return;
  }
  // Play a random playable card from hand, do not change suits by queens
  var chosenCard = pickRandomCard(playableCards);
  // If a queen is played, choose the suit of a remaining card
  // which we want to play in the next round; if the queen is
  // not our last card to play now
  if (chosenCard.rank === _Ranks2.default.queen && availableCards.length > 1) {
    // Cards remaining in hand after playing the queen
    var otherCards = availableCards.filter(function (card) {
      return card !== chosenCard;
    }),
        nextCard = pickRandomCard(otherCards);
    this.game.rules.chosenSuit = nextCard.suit;
  }
  return chosenCard;
}

function pickRandomCard(cards) {
  var cardIndex = Math.trunc(cards.length * Math.random());
  return cards[cardIndex];
}

exports.default = DummyComputer;
//# sourceMappingURL=DummyComputer.js.map
