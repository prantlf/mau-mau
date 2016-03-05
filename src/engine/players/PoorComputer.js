import Computer from './Computer';
import Ranks from './../cards/Ranks';
import i18n from '../misc/i18n';

// Plays a random playable card from his hand.  If the card is a queen,
// he wishes the suit of a random remaining card in his hand.

class PoorComputer extends Computer {

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
    return i18n.translate('poor $[1]',
      Computer.prototype.toString.apply(this, arguments));
  }

}

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
  if (chosenCard.rank === Ranks.queen && availableCards.length > 1) {
    // Cards remaining in hand after playing the queen
    let otherCards = availableCards.filter(function (card) {
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

export default PoorComputer;
