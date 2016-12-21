'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = require('../misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function () {
  function Card(suit, rank) {
    _classCallCheck(this, Card);

    this.suit = suit;
    this.rank = rank;
    // No tinkering with the card after it was "printed"
    Object.freeze(this);
  }

  _createClass(Card, [{
    key: 'toString',
    value: function toString() {
      return _i18n2.default.translate('$[1] $[2]', _i18n2.default.translate(this.rank), _i18n2.default.translate(this.suit));
    }
  }]);

  return Card;
}();

exports.default = Card;
//# sourceMappingURL=Card.js.map
