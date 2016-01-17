import Computer from './Computer';
import Ranks from './../cards/Ranks';
import i18n from '../misc/i18n';

class SmartComputer extends Computer {

  chooseCard() {
    var playableCards = this.game.rules.pickPlayableCards(this.hand),
        queens = [], sevens = [],
        otherCards, chosenCard;

    // No playable card found will mean drawing a new one
    if (!playableCards.length) {
      return new Promise(function (resolve, reject) {
        reject();
      });
    }

    // Try to get rid of all cards except for queens,
    // sevens may need looking at the game
    otherCards = playableCards.filter(function (card) {
      if (card.rank === Ranks.queen) {
        queens.push(card);
        return false;
      }
      if (card.rank === Ranks.seven) {
        sevens.push(card);
        return false;
      }
      return true;
    });

    // Prefer to "feed cards" the other players by sevens
    if (sevens.length) {
      // If there are just two players, avoid "being fed"
      // two cards by another seven placed on mine
      if (this.game.players.length > 2) {
        chosenCard = sevens.find(function (seven) {
          return playableCards.find(function (card) {
            return seven.suit === card.suit;
          });
        });
      }
    }

    // If no seven was safe, play other card and if no other
    // card remains, play a seven or a queen
    if (!chosenCard) {
      if (otherCards.length) {
        chosenCard = otherCards[0];
      } else {
        chosenCard = sevens[0] || queens[0];
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

  toString() {
    return Computer.prototype.toString.apply(this, arguments) +
           ' (' + i18n.translate('smart') + ')';
  }

}

export default SmartComputer;
