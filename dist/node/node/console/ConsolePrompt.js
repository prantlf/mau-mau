'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Prompt2 = require('../../engine/game/Prompt');

var _Prompt3 = _interopRequireDefault(_Prompt2);

var _Ranks = require('../../engine/cards/Ranks');

var _Ranks2 = _interopRequireDefault(_Ranks);

var _Suits = require('../../engine/cards/Suits');

var _Suits2 = _interopRequireDefault(_Suits);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _i18n = require('../../engine/misc/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConsolePrompt = function (_Prompt) {
  _inherits(ConsolePrompt, _Prompt);

  function ConsolePrompt() {
    _classCallCheck(this, ConsolePrompt);

    return _possibleConstructorReturn(this, (ConsolePrompt.__proto__ || Object.getPrototypeOf(ConsolePrompt)).apply(this, arguments));
  }

  _createClass(ConsolePrompt, [{
    key: 'chooseCard',
    value: function chooseCard(player) {
      return _chooseCard.call(this, player);
    }
  }]);

  return ConsolePrompt;
}(_Prompt3.default);

function _chooseCard(player) {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var playableCards = _this2.game.rules.pickPlayableCards(player.hand),
        otherCards = player.hand.pickCards(function (card) {
      return playableCards.indexOf(card) < 0;
    }).map(function (card) {
      return new _inquirer2.default.Separator(_i18n2.default.translate('Hold $[1]', card));
    }),
        cardChoices = playableCards.map(function (card) {
      return {
        name: _i18n2.default.translate('Play $[1]', card),
        value: card
      };
    }),
        topCard = _this2.game.playingStack.peekAtTopCard(),
        chosenSuit = topCard.rank === _Ranks2.default.queen && _this2.game.rules.chosenSuit ? _i18n2.default.translate(' and chooses $[1]', _i18n2.default.translate(_this2.game.rules.chosenSuit)) : '';
    _this2.game.activePlayers.forEach(function (player) {
      console.log('  ' + _i18n2.default.translate('$[1] holds $[2] cards', player, player.hand.cardCount));
    });
    console.log('  ' + _i18n2.default.translate('$[1] is on playing stack', topCard) + chosenSuit);
    console.log('  ------------------------------');
    if (playableCards.length && otherCards.length) {
      cardChoices.unshift(new _inquirer2.default.Separator());
    }
    _inquirer2.default.prompt([{
      name: 'chosenCard',
      type: 'list',
      message: _i18n2.default.translate('$[1], choose a card to play or draw a new one', player),
      choices: otherCards.concat(cardChoices, new _inquirer2.default.Separator(), {
        name: _i18n2.default.translate('Draw new card'),
        value: null
      })
    }]).then(function (answer) {
      if (answer.chosenCard) {
        var chosenCard = answer.chosenCard;
        if (chosenCard.rank === _Ranks2.default.queen && player.hand.cardCount > 1) {
          chooseSuit.call(_this2).then(function () {
            resolve(chosenCard);
          });
        } else {
          resolve(chosenCard);
        }
      } else {
        reject();
      }
    });
  });
}

function chooseSuit() {
  var _this3 = this;

  return _inquirer2.default.prompt([{
    name: 'chosenSuit',
    type: 'list',
    message: _i18n2.default.translate('Choose a suit'),
    choices: [{
      name: _i18n2.default.translate(_Suits2.default.hearts),
      value: _Suits2.default.hearts
    }, {
      name: _i18n2.default.translate(_Suits2.default.bells),
      value: _Suits2.default.bells
    }, {
      name: _i18n2.default.translate(_Suits2.default.acorns),
      value: _Suits2.default.acorns
    }, {
      name: _i18n2.default.translate(_Suits2.default.leaves),
      value: _Suits2.default.leaves
    }]
  }]).then(function (answer) {
    _this3.game.rules.chosenSuit = answer.chosenSuit;
  });
}

exports.default = ConsolePrompt;
//# sourceMappingURL=ConsolePrompt.js.map
