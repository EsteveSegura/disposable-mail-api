class InvalidMailCreationError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

module.exports = InvalidMailCreationError;
