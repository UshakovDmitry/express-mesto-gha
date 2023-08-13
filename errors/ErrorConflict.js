class ErrorConflict extends Error {
  constructor(message = 'Произошел конфликт') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;
