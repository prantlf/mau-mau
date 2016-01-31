import Ranks from '../cards/Ranks';
import Deck from '../cards/Deck';
import Player from '../players/Player';
import EventEmitter from './EventEmitter';
import i18n from './i18n';

class Reporter extends EventEmitter {

  constructor(game) {
    super();

    let gameStarted = false,
        drawsTwo = null;

    game
        .on('game:starting', () => {
          this.emit('reporter:message', i18n.translate(
              '$[1] players started with $[2] cards ($[3] card decks)',
              game.players.length, game.deck.cardCount,
              game.deck.cardCount / Deck.cardCount));
        })
        .on('game:started', () => {
          this.emit('reporter:message', i18n.translate(
                  'each player was dealt $[1] cards',
                  game.cardsPerPlayer) + ', ' + i18n.translate(
                  '$[1] is on playing stack',
                  game.playingStack.peekAtTopCard()));
          gameStarted = true;
        })
        .on('game:turning-over', () => {
          this.emit('reporter:message', 'Turning over the playing stack.');
        })
        .on('game:partial-win', winner => {
          var message = winner === game.firstWinner ?
                '$[1] won' : '$[1] shed all cards';
          this.emit('reporter:message', {
            playerIndex: game.players.indexOf(winner),
            important: true,
            message: i18n.translate(message, winner)
          });
        })
        .on('game:finished', winner => {
          if (game.continueToEnd) {
            let loser = game.activePlayers[0];
            this.emit('reporter:message', {
              playerIndex: game.players.indexOf(loser),
              important: true,
              message: i18n.translate('$[1] lost', loser)
            });
          }
        });

    game.players.forEach(player => {
      player.hand
          .on('cards:dropped', (cards) => {
            // Do not report cards the player was dealt
            if (gameStarted) {
              // Cards can be dropped just by one
              let card = cards[0],
                  suit = card.rank === Ranks.queen && game.rules.chosenSuit ?
                         i18n.translate(' and chose $[1]',
                             i18n.translate(game.rules.chosenSuit)) : '';
              this.emit('reporter:message', {
                playerIndex: game.players.indexOf(player),
                message: i18n.translate('$[1] played $[2]', player, card) + suit
              });
              // Cards can be drawn just by one; when another player plays,
              // reset the slot for the player who was taking two cards
              if (player !== drawsTwo) {
                drawsTwo = null;
              }
            }
          })
          .on('cards:received', (cards) => {
            // Do not report cards the player was dealt
            if (gameStarted) {
              // Do not report the two cards drawn when a seven was seen
              if (player !== drawsTwo) {
                this.emit('reporter:message', {
                  playerIndex: game.players.indexOf(player),
                  message: i18n.translate('$[1] drew a card', player)
                });
                // Cards can be drawn just by one; when another player plays,
                // reset the slot for the player who was taking two cards
                drawsTwo = null;
              }
            }
          });
    });

    game.rules
        .on('rule:take-turn', () => {
          if (!game.activePlayers.indexOf(game.currentPlayer)) {
            this.emit('reporter:message', {
              divider: true,
              message: '---'
            });
          }
        })
        .on('rule:pause', () => {
          var player = game.currentPlayer;
          this.emit('reporter:message', {
            playerIndex: game.players.indexOf(player),
            message: i18n.translate('$[1] had to pause', player)
          });
        })
        .on('rule:take-two', () => {
          var player = game.currentPlayer;
          this.emit('reporter:message', {
            playerIndex: game.players.indexOf(player),
            message: i18n.translate('$[1] had to draw two cards', player)
          });
          drawsTwo = player;
        });
  }

}

export default Reporter;
