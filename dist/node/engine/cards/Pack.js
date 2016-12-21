'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmitter2 = require('./../misc/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pack = function (_EventEmitter) {
  _inherits(Pack, _EventEmitter);

  function Pack() {
    _classCallCheck(this, Pack);

    var _this = _possibleConstructorReturn(this, (Pack.__proto__ || Object.getPrototypeOf(Pack)).call(this));

    _this.cards = [];
    return _this;
  }

  _createClass(Pack, [{
    key: 'drawAllCards',
    value: function drawAllCards() {
      var cards = this.cards.splice(0, this.cards.length);
      if (cards.length) {
        this.emit('cards:dropped', cards);
      }
      return cards;
    }
  }, {
    key: 'cardCount',
    get: function get() {
      return this.cards.length;
    }
  }]);

  return Pack;
}(_EventEmitter3.default);

exports.default = Pack;
//# sourceMappingURL=Pack.js.map
