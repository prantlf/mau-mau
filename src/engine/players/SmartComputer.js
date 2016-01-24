import Computer from './Computer';
import Ranks from './../cards/Ranks';
import Suits from './../cards/Suits';
import i18n from '../misc/i18n';

// Plays a card from his hand, preferring a seven or an ace to other cards
// and leaving the queens to the end.  He choses the seven or ace, which
// allows shedding the maximum cards, when the other sevens and aces were
// played one after another.  If only two players are playing, he avoids
// playing sevens or aces, unless he has another card of the same suite to
// cover them, or there is no other card to play. He only plays a queen,
// if there is no other playable card, and he wishes the suit of a card
// remaining in his hand, which we would play next time according to the
// same rules.

class SmartComputer extends Computer {

  chooseCard() {
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

  toString() {
    return i18n.translate('smart $[1]',
      Computer.prototype.toString.apply(this, arguments));
  }

}

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
  var {otherCards, queens, sevens, aces} = divideCardRanks(playableCards),
      chosenCard = {};

  // Prefer to "feed cards" the other players by sevens
  if (sevens.length) {
    chosenCard = getMaximumCoveredSeven.call(this, sevens, playableCards);
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
    chosenCard = getMaximumCoveredAce.call(this, aces, playableCards);
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
  if (chosenCard.card.rank === Ranks.queen &&
      availableCards.length > 1) {
    this.game.rules.chosenSuit = suggestSuit.call(this,
      chosenCard, availableCards);
  }

  return chosenCard;
}

function suggestSuit(chosenCard, availableCards) {
  // Cards remaining in hand after playing the queen
  var otherCards = availableCards.filter(function (card) {
        return card !== chosenCard.card;
      }),
      // Choose a card from the remaining cards, one for each
      // suit, that the quuen can wish now
      nextChosenCards = Object.keys(Suits).map(suit => {
        var playableCards = this.game.rules.pickPlayableCardsForSuit(
              otherCards, suit);
        return suggestCard.call(this, otherCards, playableCards);
      }),
      // Pick the card, which allows us to shed the most cards
      maximumCover = pickMaximumCover(nextChosenCards);
  return maximumCover.card.suit;
}

function divideCardRanks(playableCards) {
  var queens = [], sevens = [], aces = [],
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
  return {
    otherCards: otherCards,
    queens: queens,
    sevens : sevens,
    aces: aces
  };
}

function pickRandomCard(cards) {
  var cardIndex = Math.trunc(cards.length * Math.random());
  return {
    card: cards[cardIndex],
    count: 1
  };
}

function getMaximumCoveredSeven(sevens, playableCards) {
  // Compute which seven can help us shed the maximum card count
  var covers = sevens.map(seven =>
    getSevenCover.call(this, seven, playableCards));
  return pickMaximumCover(covers);
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
      covers = coversByOtherSeven.concat(coversByOtherAce),
      maximumCover = coveredBySingleCard ? {
        card: seven,
        count: 1
      } : {count: 0};
  return pickMaximumCover(covers,  maximumCover);
}

function getMaximumCoveredAce(aces, playableCards) {
  // Compute which ace can help us shed the maximum card count
  var covers = aces.map(ace => getAceCover.call(this, ace, playableCards));
  return pickMaximumCover(covers);
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
      // Compute which ace or seven can help us shed the maximum card count
      covers = coversByOtherAce.concat(coversByOtherSeven),
      maximumCover = coveredBySingleCard ? {
        card: ace,
        count: 1
      } : {count: 0};
  return pickMaximumCover(covers,  maximumCover);
}

function pickMaximumCover(covers, maximumCover = {count: 0}) {
  var maximumCovers = [maximumCover];
  // Pick the card, which allows us to shed the most cards
  covers.forEach(function (cover) {
    if (cover.count > maximumCover.count) {
      maximumCover = cover;
      maximumCovers = [maximumCover];
    } else if (cover.count === maximumCover.count) {
      maximumCovers.push(cover);
    }
  });
  if (maximumCovers.length > 1) {
    let coverIndex = Math.trunc(maximumCovers.length * Math.random());
    maximumCover = maximumCovers[coverIndex];
  }
  return maximumCover;
}

export default SmartComputer;
