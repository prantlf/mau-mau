"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,a=Array(e.length);r<e.length;r++)a[r]=e[r];return a}return Array.from(e)}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function createPlayers(e){var r;return r=null==e.players?2+Math.trunc(3*Math.random()):parseInt(e.players,10),isNaN(r)?createSpecificPlayers(e.players,e.human):createRandomPlayers(r,e.human)}function createSpecificPlayers(e,r){var a={human:_Human2["default"],smart:_SmartComputer2["default"],average:_AverageComputer2["default"],poor:_PoorComputer2["default"]},e=e.split(",").map(function(e){e=e.trim().toLowerCase();var r=a[e];if(!r)throw new Error(_i18n2["default"].translate('Invalid player: "$[1]".',e));return new r}),t=parseHumanIndex(r,e.length+1);if(t&&e.splice(t-1,0,new _Human2["default"]),e.length<2)throw new Error(_i18n2["default"].translate("Two players are the minimum."));return e}function createRandomPlayers(e,r){if(2>e)throw new Error(_i18n2["default"].translate("Two players are the minimum."));var a=parseHumanIndex(r,e),t=generateComputers();return[].concat(_toConsumableArray(Array(e).keys())).map(function(e){return e+1===a?new _Human2["default"]:t.next().value})}function parseHumanIndex(e,r){if("random"===e)return 1+Math.trunc(Math.random()*r);if(null!=e){var a=parseInt(e,10);if(isNaN(a))throw new Error(_i18n2["default"].translate("Invalid human player index."));if(1>a||a>r)throw new Error(_i18n2["default"].translate("Index of the human player out of range."));return a}}function generateComputers(){var e;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:e=Math.trunc(3*Math.random()),r.t0=e,r.next=0===r.t0?4:1===r.t0?7:2===r.t0?10:13;break;case 4:return r.next=6,new _SmartComputer2["default"];case 6:return r.abrupt("break",13);case 7:return r.next=9,new _AverageComputer2["default"];case 9:return r.abrupt("break",13);case 10:return r.next=12,new _PoorComputer2["default"];case 12:return r.abrupt("break",13);case 13:r.next=0;break;case 15:case"end":return r.stop()}},_marked[0],this)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,r){for(var a=0;a<r.length;a++){var t=r[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,a,t){return a&&e(r.prototype,a),t&&e(r,t),r}}(),_Game=require("./Game"),_Game2=_interopRequireDefault(_Game),_Human=require("../players/Human"),_Human2=_interopRequireDefault(_Human),_PoorComputer=require("../players/PoorComputer"),_PoorComputer2=_interopRequireDefault(_PoorComputer),_AverageComputer=require("../players/AverageComputer"),_AverageComputer2=_interopRequireDefault(_AverageComputer),_SmartComputer=require("../players/SmartComputer"),_SmartComputer2=_interopRequireDefault(_SmartComputer),_i18n=require("../misc/i18n"),_i18n2=_interopRequireDefault(_i18n),_marked=[generateComputers].map(regeneratorRuntime.mark),Organizer=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"createGame",value:function(e){return e||(e={}),e.players=createPlayers(e),new _Game2["default"](e)}}]),e}();exports["default"]=Organizer;
//# sourceMappingURL=Organizer.js.map
