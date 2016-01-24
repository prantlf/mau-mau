"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();Object.defineProperty(exports,"__esModule",{value:!0});var _Hand=require("./Hand"),_Hand2=_interopRequireDefault(_Hand),_EventEmitter2=require("./../misc/EventEmitter"),_EventEmitter3=_interopRequireDefault(_EventEmitter2),Player=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this));return e.hand=new _Hand2["default"],e}return _inherits(t,e),_createClass(t,[{key:"attachGame",value:function(e){this.game=e}},{key:"drawCard",value:function(){var e=this.game.drawCard();e&&(this.hand.takeCard(e),this.emit("player:drawn",e))}},{key:"playCard",value:function(){var e=this;return this.chooseCard().then(function(t){e.hand.dropCard(t),e.game.playCard(t),e.emit("player:played",t)})}}]),t}(_EventEmitter3["default"]);exports["default"]=Player;
//# sourceMappingURL=Player.js.map
