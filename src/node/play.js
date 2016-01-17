import Game from '../engine/game/Game';
import Human from '../engine/players/Human';
import DummyComputer from '../engine/players/DummyComputer';
import SmartComputer from '../engine/players/SmartComputer';
import Reporter from '../engine/misc/Reporter';
import ConsoleTracer from './console/ConsoleTracer';
import ConsolePrompt from './console/ConsolePrompt';
import i18n from '../engine/misc/i18n';

var commander = require('commander')
    .version('0.1.0')
    .description('Starts a new mau-mau card game,' +
                 ' interacting on the console.\n' +
                 '  Index of the winning player is returned' +
                 ' as the program exit code.')
    .usage('[option]')
    .option('-p, --players <integer|list>',
        'Player count (4 by default) or player list', '4')
    .option('-m, --human <integer>',
        'Index of the human player (none by default)', parseInt)
    .option('-s, --silent', 'No console output (false by default)')
    .option('-l, --language <locale>',
        'Translation of texts (env.LANG by default)')
    .on('--help', function () {
      console.log('  Player list is a comma-delimited list' +
                  ' of player implementations:');
      console.log('  "human", "smart" and "dummy" identifiers ' +
                  'are available.  The default');
      console.log('  player list is "smart,dummy,smart,dummy".');
    })
    .parse(process.argv);

var locale = /^[a-zA-Z]+/.exec(commander.language || process.env.LANG || 'en');
if (locale) {
  let translations = i18n.getTranslations();
  locale = locale[0];
  if (translations['seven'][locale]) {
    i18n.setLocale(locale);
  }
}

var players = parseInt(commander.players, 10);
if (isNaN(players)) {
  players = commander.players.split(',').map(function (player) {
    player = player.trim().toLowerCase();
    if (player === 'human') {
      return new Human();
    }
    if (player === 'smart') {
      return new SmartComputer();
    }
    if (player === 'dummy') {
      return new DummyComputer();
    }
    console.log('Invalid player.');
    process.exit(-1);
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
               new Human() : getComputer();
      });
}

var smartComputer;
function getComputer() {
  smartComputer = !smartComputer;
  return smartComputer ? new SmartComputer() : new DummyComputer();
}

var prompt = new ConsolePrompt(),
    game = new Game({
      players: players,
      prompt: prompt
    });

if (!commander.silent) {
  new ConsoleTracer(new Reporter(game));
}

game.on('game:finished', function (winner) {
  process.exit(game.players.indexOf(winner) + 1);
});

export default game.start.bind(game);
