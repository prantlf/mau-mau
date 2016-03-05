'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

var _Human = require('../players/Human');

var _Human2 = _interopRequireDefault(_Human);

var _PoorComputer = require('../players/PoorComputer');

var _PoorComputer2 = _interopRequireDefault(_PoorComputer);

var _AverageComputer = require('../players/AverageComputer');

var _AverageComputer2 = _interopRequireDefault(_AverageComputer);

var _SmartComputer = require('../players/SmartComputer');

var _SmartComputer2 = _interopRequireDefault(_SmartComputer);

var _i18n = require('../misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [generateComputers].map(regeneratorRuntime.mark);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Creates a new game using options with properties of primitive types.

var Organizer = function () {
  function Organizer() {
    _classCallCheck(this, Organizer);
  }

  _createClass(Organizer, null, [{
    key: 'createGame',
    value: function createGame(options) {
      options || (options = {});
      options.players = createPlayers(options);
      return new _Game2.default(options);
    }
  }]);

  return Organizer;
}();

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
    human: _Human2.default,
    smart: _SmartComputer2.default,
    average: _AverageComputer2.default,
    poor: _PoorComputer2.default
  },
      players = players.split(',').map(function (player) {
    player = player.trim().toLowerCase();
    var PlayerClass = playerClasses[player];
    if (!PlayerClass) {
      throw new Error(_i18n2.default.translate('Invalid player: "$[1]".', player));
    }
    return new PlayerClass();
  }),
      humanIndex = parseHumanIndex(human, players.length + 1);
  if (humanIndex) {
    players.splice(humanIndex - 1, 0, new _Human2.default());
  }
  if (players.length < 2) {
    throw new Error(_i18n2.default.translate('Two players are the minimum.'));
  }
  return players;
}

function createRandomPlayers(count, human) {
  if (count < 2) {
    throw new Error(_i18n2.default.translate('Two players are the minimum.'));
  }
  var humanIndex = parseHumanIndex(human, count),
      computers = generateComputers();
  return [].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
    return index + 1 === humanIndex ? new _Human2.default() : computers.next().value;
  });
}

function parseHumanIndex(human, playerCount) {
  if (human === 'random') {
    return 1 + Math.trunc(Math.random() * playerCount);
  }
  if (human != null) {
    var humanIndex = parseInt(human, 10);
    if (isNaN(humanIndex)) {
      throw new Error(_i18n2.default.translate('Invalid human player index.'));
    }
    if (humanIndex < 1 || humanIndex > playerCount) {
      throw new Error(_i18n2.default.translate('Index of the human player out of range.'));
    }
    return humanIndex;
  }
}

function generateComputers() {
  var which;
  return regeneratorRuntime.wrap(function generateComputers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          which = Math.trunc(Math.random() * 3);
          _context.t0 = which;
          _context.next = _context.t0 === 0 ? 4 : _context.t0 === 1 ? 7 : _context.t0 === 2 ? 10 : 13;
          break;

        case 4:
          _context.next = 6;
          return new _SmartComputer2.default();

        case 6:
          return _context.abrupt('break', 13);

        case 7:
          _context.next = 9;
          return new _AverageComputer2.default();

        case 9:
          return _context.abrupt('break', 13);

        case 10:
          _context.next = 12;
          return new _PoorComputer2.default();

        case 12:
          return _context.abrupt('break', 13);

        case 13:
          _context.next = 0;
          break;

        case 15:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

exports.default = Organizer;
//# sourceMappingURL=Organizer.js.map
