import Computer from './Computer';
import Ranks from './../cards/Ranks';
import i18n from '../misc/i18n';

class SmartComputer extends Computer {

  chooseCard() {
    var chosenCard = suggestCard.call(this,
      this.game.rules.pickPlayableCards(this.hand));
    return new Promise(function (resolve, reject) {
      if (chosenCard) {
        resolve(chosenCard);
      } else {
        reject();
      }
    });
  }

  toString() {
    return Computer.prototype.toString.apply(this, arguments) +
           ' (' + i18n.translate('smart') + ')';
  }

}

function suggestCard(playableCards) {
  var queens = [], sevens = [], aces = [],
      otherCards, chosenCard;

  // No playable card found will mean drawing a new one
  if (!playableCards.length) {
    return;
  }

  // Try to get rid of all cards except for queens,
  // sevens may need looking at the game
  otherCards = playableCards.filter(function (card) {
    switch (card.rank) {
    case Ranks.queen:
      queens.push(card);
      return false;
    case Ranks.seven:
      sevens.push(card);
      return false;
    case Ranks.ace:
      aces.push(card);
      return false;
    }
    return true;
  });

  // Prefer to "feed cards" the other players by sevens
  if (sevens.length) {
    // If there are just two players, avoid "being fed back" two cards
    // by another seven placed on ours; do not worry with more players
    if (this.game.players.length === 2) {
      chosenCard = getMaximumCoveredSeven.call(this, sevens, playableCards);
    }
  }

  // Prefer to "shed cards" quicker by a batch of aces
  if (aces.length) {
    // If there are just two players, avoid an immediate drawing a single
    // card to let the other player play; do not worry with more players
    if (this.game.players.length === 2) {
      chosenCard = getMaximumCoveredAce.call(this, aces, playableCards);
    }
  }

  // If no seven was safe and no ace was covered, play other card
  // and if no other card remains, play a seven, an ace or a queen
  if (!chosenCard) {
    if (otherCards.length) {
      let cardIndex = Math.trunc(otherCards.length * Math.random());
      chosenCard = otherCards[cardIndex];
    } else {
      if (sevens.length) {
        // It does not make much sense picking a covered seven with more then
        // two players, but nevertheless, when three players play, maybe the
        // third player will not have the suite and have to draw a card...
        chosenCard = getMaximumCoveredSeven.call(this, sevens, playableCards);
        if (!chosenCard) {
          let cardIndex = Math.trunc(sevens.length * Math.random());
          chosenCard = sevens[cardIndex];
        }
      } else if (aces.length) {
        // It does not make much sense picking a covered ace with more then
        // two players, but nevertheless, when three players play, maybe the
        // third player will play the same suit or have to draw a card...
        chosenCard = getMaximumCoveredAce.call(this, aces, playableCards);
        if (!chosenCard) {
          let cardIndex = Math.trunc(aces.length * Math.random());
          chosenCard = aces[cardIndex];
        }
      } else {
        let cardIndex = Math.trunc(queens.length * Math.random());
        chosenCard = queens[cardIndex];
      }
    }
  }

  // If a queen is played, choose the suit of a remaining card
  // which we want to play in the next round; if the queen is
  // not our last card to play now
  if (chosenCard.rank === Ranks.queen) {
    otherCards = this.hand.pickCards(function (card) {
      return playableCards.indexOf(card) < 0;
    });
    this.game.rules.chosenSuit = otherCards.length && otherCards[0].suit ||
                                 this.hand.cardCount > 1 && chosenCard.suit;
  }

  return new Promise(function (resolve) {
    resolve(chosenCard);
  });
}

function getMaximumCoveredSeven(sevens, playableCards) {
  // Compute which seven can help us shed the maximum card count
  var covers = sevens.map(seven =>
        getSevenCover.call(this, seven, playableCards)),
      maximumCover = {count: 0};
  covers.forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
    }
  });
  return maximumCover.card;
}

function getSevenCover(seven, playableCards) {
  var otherCards = playableCards.filter(function (card) {
        return card !== seven;
      }),
      // Check if the seven can be covered by a card, which lets
      // the other player play
      coveredBySingleCard = otherCards.find(function (card) {
        return card.rank !== Ranks.seven && seven.suit === card.suit;
      }),
      // Gather sevens, which could cover the current one
      coversByOtherSeven = otherCards.map(card => {
        if (card.rank === Ranks.seven) {
          let yetOtherCards = playableCards.filter(function (otherCard) {
            return card !== otherCard;
          });
          return getSevenCover.call(this, card, yetOtherCards);
        }
      }).filter(function (cover) {
        return cover && cover.count;
      }),
      // Gather aces, which could cover the seven
      coversByOtherAce = otherCards.map(card => {
        if (card.rank === Ranks.ace && seven.suit === card.suit) {
          let yetOtherCards = playableCards.filter(function (otherCard) {
            return card !== otherCard;
          });
          return getAceCover.call(this, card, yetOtherCards);
        }
      }).filter(function (cover) {
        return cover && cover.count;
      }),
  // Compute which seven or ace can help us shed the maximum card count
      maximumCover = coveredBySingleCard ? {
        card: seven,
        count: 1
      } : {count: 0};
  coversByOtherSeven.concat(coversByOtherAce).forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
    }
  });
  return maximumCover;
}

function getMaximumCoveredAce(aces, playableCards) {
  // Compute which ace can help us shed the maximum card count
  var covers = aces.map(ace => getAceCover.call(this, ace, playableCards)),
      maximumCover = {count: 0};
  covers.forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
    }
  });
  return maximumCover.card;
}

function getAceCover(ace, playableCards) {
  var otherCards = playableCards.filter(function (card) {
        return card !== ace;
      }),
      // Check if the ace can be covered by a card, which lets
      // the other player play
      coveredBySingleCard = otherCards.find(function (card) {
        return card.rank !== Ranks.seven && card.rank !== Ranks.ace &&
          ace.suit === card.suit;
      }),
      // Gather aces, which could cover the current one
      coversByOtherAce = otherCards.map(card => {
        if (card.rank === Ranks.ace) {
          let yetOtherCards = playableCards.filter(function (otherCard) {
            return card !== otherCard;
          });
          return getAceCover.call(this, card, yetOtherCards);
        }
      }).filter(function (cover) {
        return cover && cover.count;
      }),
      // Gather sevens, which could cover the ace
      coversByOtherSeven = otherCards.map(card => {
        if (card.rank === Ranks.seven) {
          let yetOtherCards = playableCards.filter(function (otherCard) {
            return card !== otherCard;
          });
          return getSevenCover.call(this, card, yetOtherCards);
        }
      }).filter(function (cover) {
        return cover && cover.count;
      }),
      maximumCover = coveredBySingleCard ? {
        card: ace,
        count: 1
      } : {count: 0};
  // Compute which ace or seven can help us shed the maximum card count
  coversByOtherAce.concat(coversByOtherSeven).forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
    }
  });
  return maximumCover;
}

export default SmartComputer;
