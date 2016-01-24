import Computer from './Computer';
import Ranks from './../cards/Ranks';
import Suits from './../cards/Suits';
import i18n from '../misc/i18n';

// Plays a card from his hand, preferring a seven or an ace to other cards
// and leaving the queens to the end.  He only plays a queen, if there is no
// other playable card, and he wishes the suit of a card remaining in his
// hand, which we would play next time according to the same rules.

class AverageComputer extends Computer {

  chooseCard() {
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

  toString() {
    return i18n.translate('average $[1]',
      Computer.prototype.toString.apply(this, arguments));
  }

}

function suggestCard(availableCards, playableCards) {
  // No playable card found will mean drawing a new one
  if (!playableCards.length) {
    return;
  }

  // Try to get rid of all cards except for queens,
  // sevens and aces may need looking at the game
  var {otherCards, queens, sevens, aces} = divideCardRanks(playableCards),
      chosenCard;

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
      this.game.rules.chosenSuit = wishSuit.call(this,
        chosenCard, availableCards);
    }
  }

  return chosenCard;
}

function wishSuit(chosenCard, availableCards) {
  // Cards remaining in hand after playing the queen
  var otherCards = availableCards.filter(function (card) {
        return card !== chosenCard;
      }),
      // Choose a card from the remaining cards, one for each
      // suit, that the quuen can wish now
      nextChosenCards = Object.keys(Suits).map(suit => {
        var playableCards = this.game.rules.pickPlayableCardsForSuit(
              otherCards, suit);
        return suggestCard.call(this, otherCards, playableCards);
      }),
      // Pick a card in this order - seven, ace, other card, queen
      nextChosenCard = nextChosenCards.find(function (card) {
        return card && card.rank === Ranks.seven;
      }) || nextChosenCards.find(function (card) {
        return card && card.rank === Ranks.ace;
      }) || nextChosenCards.find(function (card) {
        return card && card.rank !== Ranks.queen;
      }) || nextChosenCards.find(function (card) {
        return !!card;
      });
  return nextChosenCard.suit;
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
  return cards[cardIndex];
}

export default AverageComputer;
