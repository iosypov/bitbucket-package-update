//TODO make some nice logger
class Logger {
  log(message) {
    console.log(message);
  }
  error(errorMessage) {
    console.log(errorMessage);
  }
}

module.exports = new Logger();
