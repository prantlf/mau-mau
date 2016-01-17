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
        if (once && once.indexOf(listener) >= 0) {
          removeListener.call(this, listeners, listener, index);
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

  addListener(event, listener) {
    addListener.call(this, event, listener);
    return this;
  }

  removeListener(event, listener) {
    var listeners = this.listeners[event];
    if (listeners) {
      var index = listeners.indexOf(listener);
      if (index >= 0) {
        removeListener.call(this, listeners, listener, index);
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

function addListener(event, listener) {
  var listeners = this.listeners[event];
  if (!listeners) {
    listeners = this.listeners[event] = [];
  }
  listeners.push(listener);
  return listeners;
}

function removeListener(listeners, listener, index) {
  if (listeners.length > 1) {
    listeners.splice(index, 1);
    let once = listeners.once;
    index = once && once.indexOf(listener);
    if (index >= 0) {
      if (once.length > 1) {
        once.splice(index, 1);
      } else {
        delete listeners.once;
      }
    }
  } else {
    delete this.listeners[event];
  }
}

export default EventEmitter;
