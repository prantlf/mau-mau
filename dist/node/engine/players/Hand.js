'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pack2 = require('./../cards/Pack');

var _Pack3 = _interopRequireDefault(_Pack2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Implements what a hand with cards can do.

var Hand = function (_Pack) {
  _inherits(Hand, _Pack);

  function Hand() {
    _classCallCheck(this, Hand);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Hand).apply(this, arguments));
  }

  _createClass(Hand, [{
    key: 'takeCard',
    value: function takeCard(card) {
      this.cards.splice(0, 0, card);
      this.emit('cards:received', [card]);
    }
  }, {
    key: 'dropCard',
    value: function dropCard(card) {
      var index = this.cards.indexOf(card);
      if (index >= 0) {
        this.cards.splice(index, 1);
        this.emit('cards:dropped', [card]);
      }
    }
  }, {
    key: 'pickCards',
    value: function pickCards(filter) {
      return this.cards.filter(filter || function () {
        return true;
      });
    }
  }]);

  return Hand;
}(_Pack3.default);

exports.default = Hand;
//# sourceMappingURL=Hand.js.map
