"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function initializeRules(e){this.rules=e.rules||new _Rules2["default"],this.rules.attachGame(this),this.cardsPerPlayer=e.cardsPerPlayer||this.rules.defaultCardsPerPlayer,this.playersPerPack=e.playersPerPack||this.rules.defaultPlayersPerPack,this.continueToEnd=void 0!==e.continueToEnd?e.continueToEnd:this.rules.defaultContinueToEnd}function initializePlayers(e){var t=this;this.players=[],e.players&&e.players.forEach(function(e){t.players.push(e),e.attachGame(t)}),this.activePlayers=this.players.slice(),this.currentPlayerIndex=0,this.firstWinner=void 0}function initializeDeck(e){if(this.deck=e.deck||new _Deck2["default"],!e.deck)for(var t=Math.trunc((this.players.length-1)/this.playersPerPack);--t>=0;)this.deck.putCardsToBottom((new _Deck2["default"]).drawAllCards());this.drawingStack=new _DrawingStack2["default"],this.playingStack=new _PlayingStack2["default"]}function initializePrompt(e){e.prompt&&(this.prompt=e.prompt,this.prompt.attachGame(this))}function checkForStacksTurnOver(){if(0===this.drawingStack.cardCount){this.emit("game:turning-over");var e=this.playingStack.drawCardFromTop(),t=this.playingStack.drawAllCards();shuffleCards.call(this,t),this.drawingStack.putCardsToBottom(t),this.playingStack.putCardOnTop(e),this.emit("game:turned-over")}}function advanceToOtherPlayer(){this.currentPlayerIndex<this.activePlayers.length-1?++this.currentPlayerIndex:this.currentPlayerIndex=0}function advanceFromPartialWinner(){this.activePlayers.splice(this.currentPlayerIndex,1),this.currentPlayerIndex===this.activePlayers.length&&(this.currentPlayerIndex=0)}function shuffleCards(e){for(var t=e.length,r=Math.trunc(t*(1+Math.random()));--r>=0;)e.splice(Math.trunc(t*Math.random()),0,e.shift())}function dealCards(){for(var e=this.cardsPerPlayer;--e>=0;)this.players.forEach(function(e){e.drawCard()})}function nextTurn(){var e=this;this.rules.nextTurn().then(function(){checkPartialWinner.call(e)?advanceFromPartialWinner.call(e):advanceToOtherPlayer.call(e),1===e.activePlayers.length||e.firstWinner&&!e.continueToEnd?(Object.freeze(e),e.emit("game:finished",e.firstWinner)):(setTimeout(nextTurn.bind(e),0),e.emit("game:next-turn"))})["catch"](function(e){console.log(e)})}function checkPartialWinner(){var e=this.rules.whoWins();return e?(this.firstWinner||(this.firstWinner=e),this.emit("game:partial-win",e),!0):void 0}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}();Object.defineProperty(exports,"__esModule",{value:!0});var _Deck=require("./../cards/Deck"),_Deck2=_interopRequireDefault(_Deck),_DrawingStack=require("./DrawingStack"),_DrawingStack2=_interopRequireDefault(_DrawingStack),_PlayingStack=require("./PlayingStack"),_PlayingStack2=_interopRequireDefault(_PlayingStack),_Rules=require("./Rules"),_Rules2=_interopRequireDefault(_Rules),_EventEmitter2=require("./../misc/EventEmitter"),_EventEmitter3=_interopRequireDefault(_EventEmitter2),Game=function(e){function t(e){_classCallCheck(this,t);var r=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this));return e||(e={}),initializeRules.call(r,e),initializePlayers.call(r,e),initializeDeck.call(r,e),initializePrompt.call(r,e),r.drawingStack.on("cards:dropped",checkForStacksTurnOver.bind(r)),r}return _inherits(t,e),_createClass(t,[{key:"start",value:function(){this.emit("game:starting");var e=this.deck.drawAllCards();shuffleCards.call(this,e),this.drawingStack.putCardsToBottom(e),dealCards.call(this),this.playingStack.putCardOnTop(this.drawingStack.drawCardFromTop()),Object.freeze(this.players),setTimeout(nextTurn.bind(this),0),this.emit("game:started")}},{key:"chooseCard",value:function(e){return this.prompt.chooseCard(e)}},{key:"drawCard",value:function(){return 0===this.drawingStack.cardCount&&this.emit("game:cannot-draw-cards"),this.drawingStack.drawCardFromTop()}},{key:"playCard",value:function(e){this.playingStack.putCardOnTop(e)}},{key:"nextGame",value:function(){var e=this;return this.deck.removeAllListeners(),this.drawingStack.removeAllListeners(),this.playingStack.removeAllListeners(),this.rules.removeAllListeners(),this.removeAllListeners(),this.players.forEach(function(e){return e.hand.removeAllListeners()}),this.deck.putCardsToBottom(this.drawingStack.drawAllCards()),this.deck.putCardsToBottom(this.playingStack.drawAllCards()),this.players.forEach(function(t){return e.deck.putCardsToBottom(t.hand.drawAllCards())}),new(this.constructor({players:this.players,deck:this.deck,rules:this.rules,prompt:this.prompt,cardsPerPlayer:this.cardsPerPlayer,playersPerPack:this.playersPerPack}))}},{key:"currentPlayer",get:function(){return this.activePlayers[this.currentPlayerIndex]}}]),t}(_EventEmitter3["default"]);exports["default"]=Game;
//# sourceMappingURL=Game.js.map
