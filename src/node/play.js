import Game from '../engine/game/Game';
import Human from '../engine/players/Human';
import DummyComputer from '../engine/players/DummyComputer';
import AverageComputer from '../engine/players/AverageComputer';
import SmartComputer from '../engine/players/SmartComputer';
import Reporter from '../engine/misc/Reporter';
import ConsoleTracer from './console/ConsoleTracer';
import ConsolePrompt from './console/ConsolePrompt';
import i18n from '../engine/misc/i18n';

var commander = require('commander')
    .version('0.1.0')
    .description('Starts a new mau-mau card game,' +
                 ' interacting on the console.  One-based\n' +
                 '  index of the winning player is returned' +
                 ' as the program exit code.')
    .usage('[option]')
    .option('-p, --players <integer|list>',
        'Player count (3 by default) or player list', '3')
    .option('-m, --human <integer>',
        'One-based index of the human (no by default)',
        parseIntegerArgument)
    .option('-s, --silent',
        'No console output (false by default)')
    .option('-l, --language <locale>',
        'Translation of texts (env.LANG by default)')
    .option('--continue-to-end <yes|no>',
        'Play until the last player remains with some\n' +
        '                              ' +
        'cards in his hand (yes by default)',
        parseBooleanArgument, true)
    .option('--cards-per-player <integer>',
        'Number of cards that the players are dealt\n' +
        '                              ' +
        '(4 by default)',
        parseIntegerArgument, 4)
    .option('--players-per-deck <integer>',
        'Player threshold to add another card deck\n' +
        '                              ' +
        '(4 by default; 5 means another deck)',
        parseIntegerArgument, 4)
    .on('--help', function () {
      console.log('  Player list is a comma-delimited list' +
                  ' of player implementations:');
      console.log('  "human", "smart", "average" and "dummy"' +
                  ' identifiers are available.');
      console.log('  The default player list is "smart,average,dummy".');
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
      console.log('Invalid argument: "' + value + '"');
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
    console.log('Invalid argument: "' + value + '"');
    process.exit(-1);
  }
  return defaultValue;
}

var locale = /^[a-zA-Z]+/.exec(commander.language ||
  process.env.LANG || 'en');
if (locale) {
  let translations = i18n.getTranslations();
  locale = locale[0];
  if (locale !== 'en') {
    // Check any text - seven card rank, for example.
    if (translations['seven'][locale]) {
      i18n.setLocale(locale);
    } else {
      console.log('Unsupported locale: "' + locale + '"');
      console.log('English will be used instead.');
    }
  }
}

function* getComputers() {
  for (;;) {
    yield new SmartComputer();
    yield new AverageComputer();
    yield new DummyComputer();
  }
}

var computers = getComputers(),
    playerClasses = {
      human: Human,
      smart: SmartComputer,
      average: AverageComputer,
      dummy: DummyComputer
    },
    players = parseInt(commander.players, 10);
if (isNaN(players)) {
  players = commander.players.split(',').map(function (player) {
    player = player.trim().toLowerCase();
    let PlayerClass = playerClasses[player];
    if (!PlayerClass) {
      console.log('Invalid player.');
      process.exit(-1);
    }
    return new PlayerClass();
  });
} else {
  if (players < 2) {
    console.log('Two players are the minimum.');
    process.exit(-1);
  }
  if (commander.human < 1 || commander.human > players) {
    console.log('Index of the human player out of the player count.');
    process.exit(-1);
  }
  players = [...Array(players).keys()]
      .map(function (index) {
        return index + 1 === commander.human ?
               new Human() : computers.next().value;
      });
}

var prompt = new ConsolePrompt(),
    game = new Game({
      players: players,
      prompt: prompt,
      continueToEnd: commander.continueToEnd,
      cardsPerPlayer: commander.cardsPerPlayer,
      playersPerPack: commander.playersPerDeck
    });

if (!commander.silent) {
  new ConsoleTracer(new Reporter(game));
}

game
    .on('game:cannot-draw-cards', function () {
      console.log('Cannot draw cards any more.  Take additional card' +
        ' decks, \ndeal fewer cards, or reduce the count of players.');
      process.exit(-1);
    })
    .on('game:finished', function (winner) {
      process.exit(game.players.indexOf(winner) + 1);
    });

export default game.start.bind(game);
