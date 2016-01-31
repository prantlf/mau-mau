// I should want to optimize the event removal without so many parameters
/*eslint max-params: [2, 6]*/

class EventEmitter {

  constructor() {
    this.listeners = {};
    this.onceOnly = {};
  }

  emit(event) {
    var listeners = this.listeners[event];
    if (listeners) {
      var parameters = Array.prototype.slice.call(arguments, 1);
      listeners.forEach((listener, index) => {
        listener.apply(this, parameters);
        let once = listeners.once;
        if (once) {
          let onceIndex = once.indexOf(listener);
          if (onceIndex >= 0) {
            removeListener.call(this, event, listener, listeners, index,
              once, onceIndex);
          }
        }
      });
    }
  }

  on(event, listener) {
    addListener.call(this, event, listener);
    return this;
  }

  once(event, listener) {
    var listeners = addListener.call(this, event, listener),
        once = listeners.once || (listeners.once = []);
    once.push(listener);
    return this;
  }

  removeListener(event, listener) {
    var listeners = this.listeners[event];
    if (listeners) {
      var index = listeners.indexOf(listener);
      if (index >= 0) {
        removeListener.call(this, event, listener, listeners, index);
      }
    }
  }

  removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

}

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

function addListener(event, listener) {
  var listeners = this.listeners[event];
  if (!listeners) {
    listeners = this.listeners[event] = [];
  }
  listeners.push(listener);
  return listeners;
}

function removeListener(event, listener, listeners, index, once, onceIndex) {
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

export default EventEmitter;
