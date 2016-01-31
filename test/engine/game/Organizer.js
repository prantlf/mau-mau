import {expect} from 'chai';
import Organizer from '../../../node/engine/game/Organizer';
import Human from '../../../node/engine/players/Human';
import DummyComputer from '../../../node/engine/players/DummyComputer';
import AverageComputer from '../../../node/engine/players/AverageComputer';
import SmartComputer from '../../../node/engine/players/SmartComputer';

describe('Game organizer', function () {
  // Babel produces too many extra statements, or the checker has a bug
  /*eslint max-statements: [2, 20]*/
  
  it('gathers random players if none were specified', function () {
    var games = [...Array(5).keys()].map(function () {
          return Organizer.createGame();
        }),
        differentCount = games.find(function (game) {
          return game.players.length !== games[0].players.length;
        }),
        differentPlayers = games.find(function (game) {
          return game.players.find(differentPlayer);
        });
    expect(differentCount && differentPlayers).to.be.ok;
  });

  function differentPlayer(player) {
    return Object.getPrototypeOf(player) !==
      Object.getPrototypeOf(player.game.players[0]);
  }

  it('fails to create a game with malformed player identifiers', function () {
    expect(function () {
      Organizer.createGame({
        players: 'test'
      });
    }).to.throw(Error);
  });

  it('refuses to create a game with no players', function () {
    expect(function () {
      Organizer.createGame({
        players: 0
      });
    }).to.throw(Error);
  });

  it('refuses to create a game with a single random player', function () {
    expect(function () {
      Organizer.createGame({
        players: 1
      });
    }).to.throw(Error);
  });

  it('refuses to create a game with a single specific player', function () {
    expect(function () {
      Organizer.createGame({
        players: 'smart'
      });
    }).to.throw(Error);
  });

  it('can create a game with two random players', function () {
    var game = Organizer.createGame({
      players: 2
    });
    expect(game.players.length).to.be.equal(2);
  });

  it('can create a game with two specific players', function () {
    var game = Organizer.createGame({
      players: 'smart,dummy'
    });
    expect(game.players.length).to.be.equal(2);
  });

  it('can create a game with all random computer players', function () {
    var game = Organizer.createGame({
          players: 15
        }),
        playersFound = game.players.reduce(function (found, player) {
          found[Object.getPrototypeOf(player)] = true;
          return found;
        }, {});
    expect(game.players.length).to.be.equal(15);
    expect(playersFound[Human.prototype]).to.not.be.ok;
    expect(playersFound[SmartComputer.prototype]).to.be.ok;
    expect(playersFound[AverageComputer.prototype]).to.be.ok;
    expect(playersFound[DummyComputer.prototype]).to.be.ok;
  });

  it('can create a game with all specific players', function () {
    var game = Organizer.createGame({
      players: 'human,smart,average,dummy'
    });
    expect(game.players.length).to.be.equal(4);
    expect(game.players[0]).to.be.an.instanceOf(Human);
    expect(game.players[1]).to.be.an.instanceOf(SmartComputer);
    expect(game.players[2]).to.be.an.instanceOf(AverageComputer);
    expect(game.players[3]).to.be.an.instanceOf(DummyComputer);
  });

  it('fails to create a game with malformed human player index', function () {
    expect(function () {
      Organizer.createGame({
        players: 4,
        human: 'test'
      });
    }).to.throw(Error);
  });

  it('refuses to create a game with a too small human index', function () {
    expect(function () {
      Organizer.createGame({
        players: 2,
        human: 0
      });
    }).to.throw(Error);
  });

  it('refuses to create a game with a too big human index', function () {
    expect(function () {
      Organizer.createGame({
        players: 2,
        human: 3
      });
    }).to.throw(Error);
  });

  it('can let the human player to start', function () {
    var game = Organizer.createGame({
      players: 2,
      human: 1
    });
    expect(game.players.length).to.be.equal(2);
    expect(game.players[0]).to.be.an.instanceOf(Human);
    expect(game.players[1]).to.not.be.an.instanceOf(Human);
  });

  it('can place the human player to the end', function () {
    var game = Organizer.createGame({
      players: 2,
      human: 2
    });
    expect(game.players.length).to.be.equal(2);
    expect(game.players[0]).to.not.be.an.instanceOf(Human);
    expect(game.players[1]).to.be.an.instanceOf(Human);
  });

  it('can place the human player to a random position', function () {
    var games = [...Array(5).keys()].map(function () {
          return Organizer.createGame({
            players: 4,
            human: 'random'
          });
        }),
        humanIndexes = games.map(function (game) {
          return game.players.findIndex(isHuman);
        }),
        differentIndex = humanIndexes.findIndex(function (humanIndex) {
          return humanIndex !== humanIndexes[0];
        });
    expect(differentIndex).to.be.ok;
  });

  function isHuman(player) {
    return player instanceof Human;
  }

  it('can place the human player before a specific player', function () {
    var game = Organizer.createGame({
      players: 'smart,average',
      human: 2
    });
    expect(game.players.length).to.be.equal(3);
    expect(game.players[0]).to.be.an.instanceOf(SmartComputer);
    expect(game.players[1]).to.be.an.instanceOf(Human);
    expect(game.players[2]).to.be.an.instanceOf(AverageComputer);
  });

  it('can place the human player before a random player', function () {
    var game = Organizer.createGame({
          players: 'smart,average',
          human: 'random'
        }),
        humanFound = game.players.find(function (player) {
          return player instanceof Human;
        });
    expect(game.players.length).to.be.equal(3);
    expect(humanFound).to.be.ok;
  });

});
