'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Card = require('./Card');

var _Card2 = _interopRequireDefault(_Card);

var _Suits = require('./Suits');

var _Suits2 = _interopRequireDefault(_Suits);

var _Ranks = require('./Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _Stack2 = require('./Stack');

var _Stack3 = _interopRequireDefault(_Stack2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Deck = function (_Stack) {
  _inherits(Deck, _Stack);

  function Deck() {
    _classCallCheck(this, Deck);

    var _this = _possibleConstructorReturn(this, (Deck.__proto__ || Object.getPrototypeOf(Deck)).call(this));

    var cards = [new _Card2.default(_Suits2.default.leaves, _Ranks2.default.seven), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.eight), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.nine), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.ten), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.jack), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.queen), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.king), new _Card2.default(_Suits2.default.leaves, _Ranks2.default.ace), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.seven), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.eight), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.nine), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.ten), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.jack), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.queen), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.king), new _Card2.default(_Suits2.default.acorns, _Ranks2.default.ace), new _Card2.default(_Suits2.default.bells, _Ranks2.default.seven), new _Card2.default(_Suits2.default.bells, _Ranks2.default.eight), new _Card2.default(_Suits2.default.bells, _Ranks2.default.nine), new _Card2.default(_Suits2.default.bells, _Ranks2.default.ten), new _Card2.default(_Suits2.default.bells, _Ranks2.default.jack), new _Card2.default(_Suits2.default.bells, _Ranks2.default.queen), new _Card2.default(_Suits2.default.bells, _Ranks2.default.king), new _Card2.default(_Suits2.default.bells, _Ranks2.default.ace), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.seven), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.eight), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.nine), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.ten), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.jack), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.queen), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.king), new _Card2.default(_Suits2.default.hearts, _Ranks2.default.ace)];
    _this.cards.push.apply(_this.cards, cards);
    _this.emit('cards:received', cards);
    return _this;
  }

  _createClass(Deck, null, [{
    key: 'cardCount',
    get: function get() {
      return 32;
    }
  }]);

  return Deck;
}(_Stack3.default);

exports.default = Deck;
//# sourceMappingURL=Deck.js.map
