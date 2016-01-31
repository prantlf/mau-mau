import Game from './Game';
import Human from '../players/Human';
import DummyComputer from '../players/DummyComputer';
import AverageComputer from '../players/AverageComputer';
import SmartComputer from '../players/SmartComputer';
import i18n from '../misc/i18n';

// Creates a new game using options with properties of primitive types.

class Organizer {

  static createGame(options) {
    options || (options = {});
    options.players = createPlayers(options);
    return new Game(options);
  }

}

function createPlayers(options) {
  var playerCount;
  if (options.players == null) {
    playerCount = 2 + Math.trunc(Math.random() * 3);
  } else {
    playerCount = parseInt(options.players, 10);
  }
  if (isNaN(playerCount)) {
    return createSpecificPlayers(options.players, options.human);
  }
  return createRandomPlayers(playerCount, options.human);
}

function createSpecificPlayers(players, human) {
  var playerClasses = {
        human: Human,
        smart: SmartComputer,
        average: AverageComputer,
        dummy: DummyComputer
      },
      players = players.split(',').map(function (player) {
        player = player.trim().toLowerCase();
        let PlayerClass = playerClasses[player];
        if (!PlayerClass) {
          throw new Error(i18n.translate('Invalid player: "$[1]".', player));
        }
        return new PlayerClass();
      }),
      humanIndex = parseHumanIndex(human, players.length + 1);
  if (humanIndex) {
    players.splice(humanIndex - 1, 0, new Human());
  }
  if (players.length < 2) {
    throw new Error(i18n.translate('Two players are the minimum.'));
  }
  return players;
}

function createRandomPlayers(count, human) {
  if (count < 2) {
    throw new Error(i18n.translate('Two players are the minimum.'));
  }
  var humanIndex = parseHumanIndex(human, count),
      computers = generateComputers();
  return [...Array(count).keys()].map(function (index) {
    return index + 1 === humanIndex ? new Human() : computers.next().value;
  });
}

function parseHumanIndex(human, playerCount) {
  if (human === 'random') {
    return 1 + Math.trunc(Math.random() * playerCount);
  }
  if (human != null) {
    let humanIndex = parseInt(human, 10);
    if (isNaN(humanIndex)) {
      throw new Error(i18n.translate('Invalid human player index.'));
    }
    if (humanIndex < 1 || humanIndex > playerCount) {
      throw new Error(i18n.translate(
        'Index of the human player out of range.'));
    }
    return humanIndex;
  }
}

function* generateComputers() {
  for (;;) {
    let which = Math.trunc(Math.random() * 3);
    switch (which) {
    case 0:
      yield new SmartComputer();
      break;
    case 1:
      yield new AverageComputer();
      break;
    case 2:
      yield new DummyComputer();
      break;
    }
  }
}

export default Organizer;
