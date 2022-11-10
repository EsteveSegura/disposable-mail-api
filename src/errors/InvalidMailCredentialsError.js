class InvalidMailCredentialsError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

module.exports = InvalidMailCredentialsError;
