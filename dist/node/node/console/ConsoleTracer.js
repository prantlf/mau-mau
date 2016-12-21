'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsoleTracer = function ConsoleTracer(reporter) {
  _classCallCheck(this, ConsoleTracer);

  reporter.on('reporter:message', function (message) {
    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
      if (message.playerIndex !== undefined) {
        var method = _chalk2.default[getPlayerColor(message.playerIndex)];
        if (message.important) {
          method = method.bold;
        }
        message = method(message.message);
      } else if (message.divider) {
        message = '----------------------------------------';
      } else {
        message = message.message;
      }
    }
    console.log(message);
  });
};

function getPlayerColor(playerIndex) {
  return ['red', 'green', 'yellow', 'cyan'][playerIndex % 4];
}

exports.default = ConsoleTracer;
//# sourceMappingURL=ConsoleTracer.js.map
