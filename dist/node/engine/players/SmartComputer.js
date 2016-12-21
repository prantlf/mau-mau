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
// and leaving the queens to the end.  He choses the seven or ace, which
// allows shedding the maximum cards, when the other sevens and aces were
// played one after another.  If only two players are playing, he avoids
// playing sevens or aces, unless he has another card of the same suite to
// cover them, or there is no other card to play. He only plays a queen,
// if there is no other playable card, and he wishes the suit of a card
// remaining in his hand, which we would play next time according to the
// same rules.

var SmartComputer = function (_Computer) {
  _inherits(SmartComputer, _Computer);

  function SmartComputer() {
    _classCallCheck(this, SmartComputer);

    return _possibleConstructorReturn(this, (SmartComputer.__proto__ || Object.getPrototypeOf(SmartComputer)).apply(this, arguments));
  }

  _createClass(SmartComputer, [{
    key: 'chooseCard',
    value: function chooseCard() {
      var availableCards = this.hand.pickCards(),
          playableCards = this.game.rules.pickPlayableCards(this.hand),
          chosenCard = suggestCard.call(this, availableCards, playableCards),
          card = chosenCard.card;
      return new Promise(function (resolve, reject) {
        if (card) {
          resolve(card);
        } else {
          reject();
        }
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _i18n2.default.translate('smart $[1]', _Computer3.default.prototype.toString.apply(this, arguments));
    }
  }]);

  return SmartComputer;
}(_Computer3.default);

function suggestCard(availableCards, playableCards) {
  // Decomposition operation should not increase the statement count,
  // moving handling of sevens and aces to a separate method would
  // make the code less legible.
  /*eslint max-statements: [2, 20]*/
  // Moving handling of sevens, aces and queens from conditions
  // to methods would make the code less legible.
  /*eslint complexity: [2, 11]*/

  // No playable card found will mean drawing a new one
  if (!playableCards.length) {
    return {};
  }

  // Try to get rid of all cards except for queens,
  // sevens and aces may need looking at the game

  var _divideCardRanks = divideCardRanks(playableCards),
      otherCards = _divideCardRanks.otherCards,
      queens = _divideCardRanks.queens,
      sevens = _divideCardRanks.sevens,
      aces = _divideCardRanks.aces,
      chosenCard = {};

  // Prefer to "feed cards" the other players by sevens


  if (sevens.length) {
    chosenCard = getMaximumCoveredSeven.call(this, sevens, availableCards);
    // If there are just two players, avoid "being fed back" two cards
    // by another seven placed on ours; do not worry with more players
    if (!chosenCard.card && this.game.activePlayers.length > 2) {
      // It does not make much sense picking a covered seven with more then
      // two players, but nevertheless, when three players play, maybe the
      // third player will not have the suite and have to draw a card...
      chosenCard = pickRandomCard(sevens);
    }
  }

  // Prefer to "shed cards" quicker by a batch of aces
  if (!chosenCard.card && aces.length) {
    chosenCard = getMaximumCoveredAce.call(this, aces, availableCards);
    // If there are just two players, avoid an immediate drawing a single
    // card to let the other player play; do not worry with more players
    if (!chosenCard.card && this.game.activePlayers.length > 2) {
      // It does not make much sense picking a covered ace with more then
      // two players, but nevertheless, when three players play, maybe the
      // third player will play the same suit or have to draw a card...
      chosenCard = pickRandomCard(aces);
    }
  }

  // If no seven was safe and no ace was covered, play other card
  // and if no other card remains, play a seven, an ace or a queen
  if (!chosenCard.card) {
    if (otherCards.length) {
      chosenCard = pickRandomCard(otherCards);
    } else if (sevens.length) {
      chosenCard = pickRandomCard(sevens);
    } else if (aces.length) {
      chosenCard = pickRandomCard(aces);
    } else {
      chosenCard = pickRandomCard(queens);
    }
  }

  // If a queen is played, choose the suit of a remaining card
  // which we want to play in the next round; if the queen is
  // not our last card to play now
  if (chosenCard.card.rank === _Ranks2.default.queen && availableCards.length > 1) {
    this.game.rules.chosenSuit = suggestSuit.call(this, chosenCard, availableCards);
  }

  return chosenCard;
}

function suggestSuit(chosenCard, availableCards) {
  var _this2 = this;

  // Cards remaining in hand after playing the queen
  var otherCards = availableCards.filter(function (card) {
    return card !== chosenCard.card;
  }),
      nextChosenCardsPerSuit = Object.keys(_Suits2.default).map(function (suit) {
    var playableCards = _this2.game.rules.pickPlayableCardsForSuit(otherCards, suit);
    return suggestCard.call(_this2, otherCards, playableCards);
  }),
      _filterMaximumCovers = filterMaximumCovers(nextChosenCardsPerSuit),
      maximumCovers = _filterMaximumCovers.maximumCovers,
      maximumCover = _filterMaximumCovers.maximumCover,
      nextChosenCards = maximumCovers.map(function (cardCover) {
    return cardCover.card;
  }).filter(function (card) {
    return !!card;
  }),
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
  return {
    card: cards[cardIndex],
    count: 1
  };
}

function getMaximumCoveredSeven(sevens, availableCards) {
  var _this3 = this;

  // Compute which seven can help us shed the maximum card count
  var covers = sevens.map(function (seven) {
    return {
      card: seven,
      count: getSevenCoverCount.call(_this3, seven, availableCards)
    };
  });
  return pickMaximumCover(covers);
}

function getSevenCoverCount(seven, availableCards) {
  var _this4 = this;

  var otherCards = availableCards.filter(function (card) {
    return card !== seven;
  }),

  // Check if the seven can be covered by a card, which lets
  // the other player play
  coveredBySingleCard = otherCards.find(function (card) {
    return card.rank !== _Ranks2.default.seven && card.rank !== _Ranks2.default.ace && seven.suit === card.suit;
  }),

  // Gather sevens, which could cover the current one
  coverCountsByOtherSeven = otherCards.map(function (card) {
    if (card.rank === _Ranks2.default.seven) {
      // Compute how many cards can cover this another seven
      var yetOtherCards = otherCards.filter(function (otherCard) {
        return card !== otherCard;
      }),
          coverCount = getSevenCoverCount.call(_this4, card, yetOtherCards);
      return coverCount + 1;
    }
    return 0;
  }),

  // Gather aces, which could cover the seven
  coverCountsByOtherAce = otherCards.map(function (card) {
    if (card.rank === _Ranks2.default.ace && seven.suit === card.suit) {
      // Compute how many cards can cover this another ace
      var yetOtherCards = otherCards.filter(function (otherCard) {
        return card !== otherCard;
      }),
          coverCount = getAceCoverCount.call(_this4, card, yetOtherCards);
      return coverCount + 1;
    }
    return 0;
  }),

  // Compute which seven or ace can help us shed the maximum card count
  coverCounts = coverCountsByOtherSeven.concat(coverCountsByOtherAce),
      maximumCoverCount = Math.max.apply(undefined, coverCounts);
  // If the seven cannot be covered by another seven or ace,
  // from which the most efficient would be picked, return 1,
  // if other single card was found, otherwise 0
  return maximumCoverCount || coveredBySingleCard && 1 || 0;
}

function getMaximumCoveredAce(aces, availableCards) {
  var _this5 = this;

  // Compute which ace can help us shed the maximum card count
  var covers = aces.map(function (ace) {
    return {
      card: ace,
      count: getAceCoverCount.call(_this5, ace, availableCards)
    };
  });
  return pickMaximumCover(covers);
}

function getAceCoverCount(ace, availableCards) {
  var _this6 = this;

  var otherCards = availableCards.filter(function (card) {
    return card !== ace;
  }),

  // Check if the ace can be covered by a card, which lets
  // the other player play
  coveredBySingleCard = otherCards.find(function (card) {
    return card.rank !== _Ranks2.default.seven && card.rank !== _Ranks2.default.ace && ace.suit === card.suit;
  }),

  // Gather aces, which could cover the current one
  coverCountsByOtherAce = otherCards.map(function (card) {
    if (card.rank === _Ranks2.default.ace) {
      // Compute how many cards can cover this another ace
      var yetOtherCards = otherCards.filter(function (otherCard) {
        return card !== otherCard;
      }),
          coverCount = getAceCoverCount.call(_this6, card, yetOtherCards);
      return coverCount + 1;
    }
    return 0;
  }),

  // Gather sevens, which could cover the ace
  coverCountsByOtherSeven = otherCards.map(function (card) {
    if (card.rank === _Ranks2.default.seven && ace.suit === card.suit) {
      // Compute how many cards can cover this another seven
      var yetOtherCards = otherCards.filter(function (otherCard) {
        return card !== otherCard;
      }),
          coverCount = getSevenCoverCount.call(_this6, card, yetOtherCards);
      return coverCount + 1;
    }
    return 0;
  }),

  // Compute which ace or seven can help us shed the maximum card count
  coverCounts = coverCountsByOtherAce.concat(coverCountsByOtherSeven),
      maximumCoverCount = Math.max.apply(undefined, coverCounts);
  // If the ace cannot be covered by another ace or seven,
  // from which the most efficient would be picked, return 1,
  // if other single card was found, otherwise 0
  return maximumCoverCount || coveredBySingleCard && 1 || 0;
}

function pickMaximumCover(covers) {
  var _filterMaximumCovers2 = filterMaximumCovers(covers),
      maximumCovers = _filterMaximumCovers2.maximumCovers,
      maximumCover = _filterMaximumCovers2.maximumCover;

  if (maximumCovers.length > 1) {
    var coverIndex = Math.trunc(maximumCovers.length * Math.random());
    maximumCover = maximumCovers[coverIndex];
  }
  return maximumCover;
}

function filterMaximumCovers(covers) {
  var maximumCovers = [],
      maximumCover = { count: 0 };
  // Pick the card, which allows us to shed the most cards
  covers.forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
      maximumCovers = [maximumCover];
    } else if (cover.count === maximumCover.count) {
      maximumCovers.push(cover);
    }
  });
  return { maximumCovers: maximumCovers, maximumCover: maximumCover };
}

exports.default = SmartComputer;
//# sourceMappingURL=SmartComputer.js.map
