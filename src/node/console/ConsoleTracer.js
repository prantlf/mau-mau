import chalk from 'chalk';

class ConsoleTracer {

  constructor(reporter) {
    reporter.on('reporter:message', function (message) {
      if (typeof message === 'object') {
        if (message.playerIndex !== undefined) {
          let method = chalk[getPlayerColor(message.playerIndex)];
          if (message.important) {
            method = method.bold;
          }
          message = method(message.message);
        } else if (message.divider) {
          message = '----------------------------------------';
        } else {
          message = message.message;
        }
      }
      console.log(message);
    });
  }

}

function getPlayerColor(playerIndex) {
  return ['red', 'green', 'yellow', 'cyan'][playerIndex % 4];
}

export default ConsoleTracer;
