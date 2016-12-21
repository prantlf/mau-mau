'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Organizer = require('../engine/game/Organizer');

var _Organizer2 = _interopRequireDefault(_Organizer);

var _Human = require('../engine/players/Human');

var _Human2 = _interopRequireDefault(_Human);

var _PoorComputer = require('../engine/players/PoorComputer');

var _PoorComputer2 = _interopRequireDefault(_PoorComputer);

var _AverageComputer = require('../engine/players/AverageComputer');

var _AverageComputer2 = _interopRequireDefault(_AverageComputer);

var _SmartComputer = require('../engine/players/SmartComputer');

var _SmartComputer2 = _interopRequireDefault(_SmartComputer);

var _Reporter = require('../engine/misc/Reporter');

var _Reporter2 = _interopRequireDefault(_Reporter);

var _ConsoleTracer = require('./console/ConsoleTracer');

var _ConsoleTracer2 = _interopRequireDefault(_ConsoleTracer);

var _ConsolePrompt = require('./console/ConsolePrompt');

var _ConsolePrompt2 = _interopRequireDefault(_ConsolePrompt);

var _i18n = require('../engine/misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propertyFile = _path2.default.join(__dirname, '../../../package.json'),
    properties = JSON.parse(_fs2.default.readFileSync(propertyFile, 'utf-8')),
    commander = require('commander').version(properties.version).description('Starts a new mau-mau card game,' + ' interacting on the console.  One-based\n' + '  index of the winning player is returned' + ' as the program exit code.').usage('[option]').option('-p, --players <integer|list>', 'Player count (2-4 by default) or list').option('-m, --human <integer|random>', 'One-based index of the human player or the\n' + '                              ' + 'text "random" (nothing by default)', parseIntegerArgument).option('-s, --silent', 'No console output (false by default)').option('-l, --language <locale>', 'Translation of texts (env.LANG by default)').option('--continue-to-end <yes|no>', 'Play until the last player remains with\n' + '                              ' + 'some cards in his hand (yes by default)', parseBooleanArgument, true).option('--cards-per-player <integer>', 'Number of cards that the players are dealt\n' + '                              ' + 'at the beginning (4 by default)', parseIntegerArgument, 4).option('--players-per-deck <integer>', 'Player count threshold to add another card\n' + '                              ' + 'deck (4 by default; 5 means another deck)', parseIntegerArgument, 4).on('--help', function () {
  console.log('  Player list is a comma-delimited list' + ' of player implementations: "human",');
  console.log('  "smart", "average" and "poor"' + ' identifiers are available.  A random');
  console.log('  variation of "smart,average,poor" is the default.');
  var translations = _i18n2.default.getTranslations(),

  // Take any text - seven card rank, for example.
  locales = Object.keys(translations['seven']);
  console.log('  Supported locales: "en", "' + locales.join('", "') + '".');
}).parse(process.argv);

function parseIntegerArgument(value, defaultValue) {
  if (value) {
    var parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      console.log(_i18n2.default.transplate('Invalid argument: "$[1]".', value));
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
    console.log(_i18n2.default.transplate('Invalid argument: "$[1]".', value));
    process.exit(-1);
  }
  return defaultValue;
}

var locale = commander.language || process.env.LANG;
if (locale) {
  try {
    _i18n2.default.setLocaleSafely(locale);
  } catch (error) {
    console.log(error.message);
  }
}

var game;
try {
  game = _Organizer2.default.createGame({
    players: commander.players,
    human: commander.human,
    prompt: new _ConsolePrompt2.default(),
    continueToEnd: commander.continueToEnd,
    cardsPerPlayer: commander.cardsPerPlayer,
    playersPerPack: commander.playersPerDeck
  });
} catch (error) {
  console.log(error.message);
  process.exit(-1);
}

if (!commander.silent) {
  new _ConsoleTracer2.default(new _Reporter2.default(game));
}

game.on('game:cannot-draw-cards', function () {
  console.log(_i18n2.default.translate('Cannot draw cards any more.  ' + 'Take additional card decks, \n' + 'deal fewer cards, or reduce the count of players.'));
  process.exit(-1);
}).on('game:finished', function (winner) {
  process.exit(game.players.indexOf(winner) + 1);
});

exports.default = game.start.bind(game);
//# sourceMappingURL=serve.js.map
