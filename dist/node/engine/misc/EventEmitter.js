"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// I should want to optimize the event removal without so many parameters
/*eslint max-params: [2, 6]*/

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.listeners = {};
    this.onceOnly = {};
  }

  _createClass(EventEmitter, [{
    key: "emit",
    value: function emit(event) {
      var _this = this;

      var listeners = this.listeners[event];
      if (listeners) {
        var parameters = Array.prototype.slice.call(arguments, 1);
        listeners.forEach(function (listener, index) {
          listener.apply(_this, parameters);
          var once = listeners.once;
          if (once) {
            var onceIndex = once.indexOf(listener);
            if (onceIndex >= 0) {
              _removeListener.call(_this, event, listener, listeners, index, once, onceIndex);
            }
          }
        });
      }
    }
  }, {
    key: "on",
    value: function on(event, listener) {
      addListener.call(this, event, listener);
      return this;
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      var listeners = addListener.call(this, event, listener),
          once = listeners.once || (listeners.once = []);
      once.push(listener);
      return this;
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      var listeners = this.listeners[event];
      if (listeners) {
        var index = listeners.indexOf(listener);
        if (index >= 0) {
          _removeListener.call(this, event, listener, listeners, index);
        }
      }
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(event) {
      if (event) {
        delete this.listeners[event];
      } else {
        this.listeners = {};
      }
    }
  }]);

  return EventEmitter;
}();

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

function addListener(event, listener) {
  var listeners = this.listeners[event];
  if (!listeners) {
    listeners = this.listeners[event] = [];
  }
  listeners.push(listener);
  return listeners;
}

function _removeListener(event, listener, listeners, index, once, onceIndex) {
  if (listeners.length > 1) {
    listeners.splice(index, 1);
    once || (once = listeners.once);
    if (once) {
      onceIndex !== undefined || (onceIndex = once.indexOf(listener));
      removeOnceListener(listeners, once, onceIndex);
    }
  } else {
    delete this.listeners[event];
  }
}

function removeOnceListener(listeners, once, onceIndex) {
  if (onceIndex >= 0) {
    if (once.length > 1) {
      once.splice(onceIndex, 1);
    } else {
      delete listeners.once;
    }
  }
}

exports.default = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map
