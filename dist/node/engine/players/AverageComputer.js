'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Computer2 = require('./Computer');

var _Computer3 = _interopRequireDefault(_Computer2);

var _Ranks = require('./../cards/Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _Suits = require('./../cards/Suits');

var _Suits2 = _interopRequireDefault(_Suits);

var _i18n = require('../misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Plays a card from his hand, preferring a seven or an ace to other cards
// and leaving the queens to the end.  He only plays a queen, if there is no
// other playable card, and he wishes the suit of a card remaining in his
// hand, which we would play next time according to the same rules.

var AverageComputer = function (_Computer) {
  _inherits(AverageComputer, _Computer);

  function AverageComputer() {
    _classCallCheck(this, AverageComputer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AverageComputer).apply(this, arguments));
  }

  _createClass(AverageComputer, [{
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
      return _i18n2.default.translate('average $[1]', _Computer3.default.prototype.toString.apply(this, arguments));
    }
  }]);

  return AverageComputer;
}(_Computer3.default);

function suggestCard(availableCards, playableCards) {
  // No playable card found will mean drawing a new one
  if (!playableCards.length) {
    return;
  }

  // Try to get rid of all cards except for queens,
  // sevens and aces may need looking at the game

  var _divideCardRanks = divideCardRanks(playableCards);

  var otherCards = _divideCardRanks.otherCards;
  var queens = _divideCardRanks.queens;
  var sevens = _divideCardRanks.sevens;
  var aces = _divideCardRanks.aces;
  var chosenCard;

  // Prefer to "feed cards" the other players by sevens
  if (sevens.length) {
    chosenCard = pickRandomCard(sevens);
    // Prefer to "shed cards" quicker by a batch of aces
  } else if (aces.length) {
      chosenCard = pickRandomCard(aces);
      // If no seven was safe and no ace was covered, play other card
      // and if no other card remains, play a seven, an ace or a queen
    } else if (otherCards.length) {
        chosenCard = pickRandomCard(otherCards);
      } else {
        chosenCard = pickRandomCard(queens);
        // If a queen is played, choose the suit of a remaining card
        // which we want to play in the next round; if the queen is
        // not our last card to play now
        if (availableCards.length > 1) {
          this.game.rules.chosenSuit = wishSuit.call(this, chosenCard, availableCards);
        }
      }

  return chosenCard;
}

function wishSuit(chosenCard, availableCards) {
  var _this2 = this;

  // Cards remaining in hand after playing the queen
  var otherCards = availableCards.filter(function (card) {
    return card !== chosenCard;
  }),

  // Choose the best card from the remaining cards, one for each
  // suit, that the quuen can wish now
  nextChosenCards = Object.keys(_Suits2.default).map(function (suit) {
    var playableCards = _this2.game.rules.pickPlayableCardsForSuit(otherCards, suit);
    return suggestCard.call(_this2, otherCards, playableCards);
  }).filter(function (card) {
    return !!card;
  }),

  // Pick a card in this order - seven, ace, other card, queen
  nextChosenCard = nextChosenCards.find(function (card) {
    return card.rank === _Ranks2.default.seven;
  }) || nextChosenCards.find(function (card) {
    return card.rank === _Ranks2.default.ace;
  }) || nextChosenCards.find(function (card) {
    return card.rank !== _Ranks2.default.queen;
  }) ||
  // If only queens remain in the hand, the chosen suit does
  // not matter; let us return the suit of the first queen
  nextChosenCards[0];
  return nextChosenCard.suit;
}

function divideCardRanks(playableCards) {
  var queens = [],
      sevens = [],
      aces = [],
      otherCards = playableCards.filter(function (card) {
    switch (card.rank) {
      case _Ranks2.default.queen:
        queens.push(card);
        return false;
      case _Ranks2.default.seven:
        sevens.push(card);
        return false;
      case _Ranks2.default.ace:
        aces.push(card);
        return false;
    }
    return true;
  });
  return { otherCards: otherCards, queens: queens, sevens: sevens, aces: aces };
}

function pickRandomCard(cards) {
  var cardIndex = Math.trunc(cards.length * Math.random());
  return cards[cardIndex];
}

exports.default = AverageComputer;
//# sourceMappingURL=AverageComputer.js.map
