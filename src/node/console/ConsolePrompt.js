import Prompt from '../../engine/game/Prompt';
import Ranks from '../../engine/cards/Ranks';
import Suits from '../../engine/cards/Suits';
import inquirer from 'inquirer';
import i18n from '../../engine/misc/i18n';

class ConsolePrompt extends Prompt {

  chooseCard(player) {
    return chooseCard.call(this, player);
  }

}

function chooseCard(player) {
  return new Promise((resolve, reject) => {
    var playableCards = this.game.rules.pickPlayableCards(player.hand),
        otherCards = player.hand
            .pickCards(function (card) {
              return playableCards.indexOf(card) < 0;
            })
            .map(function (card) {
              return new inquirer.Separator(
                  i18n.translate('Hold $[1]', card));
            }),
        cardChoices = playableCards.map(function (card) {
          return {
            name: i18n.translate('Play $[1]', card),
            value: card
          };
        }),
        topCard = this.game.playingStack.peekAtTopCard(),
        chosenSuit = topCard.rank === Ranks.queen &&
                     this.game.rules.chosenSuit ?
                     i18n.translate(' and chooses $[1]',
                         i18n.translate(this.game.rules.chosenSuit)) :
                     '';
    this.game.players.forEach(player => {
      console.log('  ' + i18n.translate('$[1] holds $[2] cards',
              player, player.hand.cardCount));
    });
    console.log('  ' + i18n.translate('$[1] is on playing stack', topCard) +
                chosenSuit);
    console.log('  ------------------------------');
    if (playableCards.length && otherCards.length) {
      cardChoices.unshift(new inquirer.Separator());
    }
    inquirer.prompt([{
      name: 'chosenCard',
      type: 'list',
      message: i18n.translate(
          '$[1], choose a card to play or draw a new one', player),
      choices: otherCards.concat(
          cardChoices,
          new inquirer.Separator(), {
            name: i18n.translate('Draw new card'),
            value: null
          })
    }], answer => {
      if (answer.chosenCard) {
        var chosenCard = answer.chosenCard;
        if (chosenCard.rank === Ranks.queen && player.hand.cardCount > 1) {
          chooseSuit.call(this).then(function () {
            resolve(chosenCard);
          });
        } else {
          resolve(chosenCard);
        }
      } else {
        reject();
      }
    });
  });
}

function chooseSuit() {
  return new Promise((resolve) => {
    inquirer.prompt([{
      name: 'chosenSuit',
      type: 'list',
      message: i18n.translate('Choose a suit'),
      choices: [{
        name: i18n.translate(Suits.hearts),
        value: Suits.hearts
      }, {
        name: i18n.translate(Suits.bells),
        value: Suits.bells
      }, {
        name: i18n.translate(Suits.acorns),
        value: Suits.acorns
      }, {
        name: i18n.translate(Suits.leaves),
        value: Suits.leaves
      }]
    }], answer => {
      this.game.rules.chosenSuit = answer.chosenSuit;
      resolve();
    });
  });
}

export default ConsolePrompt;
