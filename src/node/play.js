import Organizer from '../engine/game/Organizer';
import Human from '../engine/players/Human';
import PoorComputer from '../engine/players/PoorComputer';
import AverageComputer from '../engine/players/AverageComputer';
import SmartComputer from '../engine/players/SmartComputer';
import Reporter from '../engine/misc/Reporter';
import ConsoleTracer from './console/ConsoleTracer';
import ConsolePrompt from './console/ConsolePrompt';
import i18n from '../engine/misc/i18n';
import path from 'path';
import fs from 'fs';

var propertyFile = path.join(__dirname, '../../../package.json'),
    properties = JSON.parse(fs.readFileSync(propertyFile, 'utf-8')),
    commander = require('commander')
    .version(properties.version)
    .description('Starts a new mau-mau card game,' +
                 ' interacting on the console.  One-based\n' +
                 '  index of the winning player is returned' +
                 ' as the program exit code.')
    .usage('[option]')
    .option('-p, --players <integer|list>',
        'Player count (2-4 by default) or list')
    .option('-m, --human <integer|random>',
        'One-based index of the human player or the\n' +
        '                              ' +
        'text "random" (nothing by default)',
        parseIntegerArgument)
    .option('-s, --silent',
        'No console output (false by default)')
    .option('-l, --language <locale>',
        'Translation of texts (env.LANG by default)')
    .option('--continue-to-end <yes|no>',
        'Play until the last player remains with\n' +
        '                              ' +
        'some cards in his hand (yes by default)',
        parseBooleanArgument, true)
    .option('--cards-per-player <integer>',
        'Number of cards that the players are dealt\n' +
        '                              ' +
        'at the beginning (4 by default)',
        parseIntegerArgument, 4)
    .option('--players-per-deck <integer>',
        'Player count threshold to add another card\n' +
        '                              ' +
        'deck (4 by default; 5 means another deck)',
        parseIntegerArgument, 4)
    .on('--help', function () {
      console.log('  Player list is a comma-delimited list' +
                  ' of player implementations: "human",');
      console.log('  "smart", "average" and "poor"' +
                  ' identifiers are available.  A random');
      console.log('  variation of "smart,average,poor" is the default.');
      let translations = i18n.getTranslations(),
          // Take any text - seven card rank, for example.
          locales = Object.keys(translations['seven']);
      console.log('  Supported locales: "en", "' +
        locales.join('", "') + '".');
    })
    .parse(process.argv);

function parseIntegerArgument(value, defaultValue) {
  if (value) {
    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      console.log(i18n.transplate('Invalid argument: "$[1]".', value));
      process.exit(-1);
    }
    return parsedValue;
  }
  return defaultValue;
}

function parseBooleanArgument(value, defaultValue) {
  if (value) {
    switch (value.trim().toLowerCase()) {
    case 'yes':
      return true;
    case 'no':
      return false;
    }
    console.log(i18n.transplate('Invalid argument: "$[1]".', value));
    process.exit(-1);
  }
  return defaultValue;
}

var locale = commander.language || process.env.LANG;
if (locale) {
  try {
    i18n.setLocaleSafely(locale);
  } catch (error) {
    console.log(error.message);
  }
}

var game;
try {
  game = Organizer.createGame({
    players: commander.players,
    human: commander.human,
    prompt: new ConsolePrompt(),
    continueToEnd: commander.continueToEnd,
    cardsPerPlayer: commander.cardsPerPlayer,
    playersPerPack: commander.playersPerDeck
  });
} catch (error) {
  console.log(error.message);
  process.exit(-1);
}

if (!commander.silent) {
  new ConsoleTracer(new Reporter(game));
}

game
    .on('game:cannot-draw-cards', function () {
      console.log(i18n.translate('Cannot draw cards any more.  ' +
        'Take additional card decks, \n' +
        'deal fewer cards, or reduce the count of players.'));
      process.exit(-1);
    })
    .on('game:finished', function (winner) {
      process.exit(game.players.indexOf(winner) + 1);
    });

export default game.start.bind(game);
