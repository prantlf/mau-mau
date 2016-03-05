'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Stack2 = require('./../cards/Stack');

var _Stack3 = _interopRequireDefault(_Stack2);

var _i18n = require('../misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawingStack = function (_Stack) {
  _inherits(DrawingStack, _Stack);

  function DrawingStack() {
    _classCallCheck(this, DrawingStack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DrawingStack).apply(this, arguments));
  }

  _createClass(DrawingStack, [{
    key: 'drawCardFromTop',
    value: function drawCardFromTop() {
      var card = this.cards.shift();
      // If the count of card decks is not balanced well with the count of
      // players and the cards they are initially dealt, the drawing stack
      // can run out of cards.
      if (card) {
        this.emit('cards:dropped', [card]);
        return card;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _i18n2.default.translate('drawing stack');
    }
  }]);

  return DrawingStack;
}(_Stack3.default);

exports.default = DrawingStack;
//# sourceMappingURL=DrawingStack.js.map
