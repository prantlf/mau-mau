import {expect} from 'chai';
import EventEmitter from '../../../node/engine/misc/EventEmitter';

// Avoid checking the describe() for maximum statements
/*eslint max-statements: [2, 13]*/ 
    
describe('Event emitter', function () {

  var eventEmitter;
  
  beforeEach(function () {
    eventEmitter = new EventEmitter();
  });

  it('adds listeners by both "on" and "addListener" methods', function () {
    expect(EventEmitter.prototype.addListener).to.be.equal(
      EventEmitter.prototype.on);
  });

  it('emits an event to all listeners', function () {
    var emitted = 0,
        emitted2;
    eventEmitter
        .on('test', function () {
          ++emitted;
        })
        .on('test', function () {
          ++emitted;
        })
        .on('test2', function () {
          emitted2 = true;
        });
    eventEmitter.emit('test');
    expect(emitted).to.be.equal(2);
    expect(emitted2).to.be.not.ok;
  });

  it('emits an event with parameters', function () {
    var emitted;
    eventEmitter.on('test', function () {
      emitted = true;
      expect(arguments.length).to.be.equal(2);
      expect(arguments[0]).to.be.equal(1);
      expect(arguments[1]).to.be.equal(2);
    });
    eventEmitter.emit('test', 1, 2);
    expect(emitted).to.be.ok;
  });

  it('emits an event multiple times', function () {
    var emitted = 0;
    eventEmitter.on('test', function () {
      ++emitted;
    });
    eventEmitter.emit('test');
    eventEmitter.emit('test');
    expect(emitted).to.be.equal(2);
  });

  it('emits an event for a just-once listener', function () {
    var emitted = 0;
    eventEmitter.once('test', function () {
      ++emitted;
    });
    eventEmitter.emit('test');
    eventEmitter.emit('test');
    expect(emitted).to.be.equal(1);
  });

  it('removes a listener', function () {
    var emitted, emitted2;
    function listener() {
      emitted = true;
    }
    eventEmitter
        .on('test', listener)
        .on('test', function () {
          emitted2 = true;
        });
    eventEmitter.removeListener('test', listener);
    eventEmitter.emit('test');
    expect(emitted).to.be.not.ok;
    expect(emitted2).to.be.ok;
  });

  it('removes a listener listening just once', function () {
    var emitted, emitted2;
    function listener() {
      emitted = true;
    }
    eventEmitter
        .once('test', listener)
        .once('test', function () {
          emitted2 = true;
        });
    eventEmitter.removeListener('test', listener);
    eventEmitter.emit('test');
    expect(emitted).to.be.not.ok;
    expect(emitted2).to.be.ok;
  });

  it('removes the last listener listening just once', function () {
    var emitted, emitted2;
    function listener() {
      emitted = true;
    }
    eventEmitter.once('test', listener);
    eventEmitter.on('test', function () {
      emitted2 = true;
    });
    eventEmitter.removeListener('test', listener);
    eventEmitter.emit('test');
    expect(emitted).to.be.not.ok;
    expect(emitted2).to.be.ok;
  });

  it('removes all listeners to one event', function () {
    var emitted, emitted2;
    eventEmitter
        .on('test', function () {
          emitted = true;
        })
        .on('test2', function () {
          emitted2 = true;
        });
    eventEmitter.removeAllListeners('test');
    eventEmitter.emit('test');
    eventEmitter.emit('test2');
    expect(emitted).to.be.not.ok;
    expect(emitted2).to.be.ok;
  });

  it('removes all listeners', function () {
    var emitted, emitted2;
    eventEmitter
        .on('test', function () {
          emitted = true;
        })
        .on('test2', function () {
          emitted2 = true;
        });
    eventEmitter.removeAllListeners();
    eventEmitter.emit('test');
    eventEmitter.emit('test2');
    expect(emitted).to.be.not.ok;
    expect(emitted2).to.be.not.ok;
  });

});
