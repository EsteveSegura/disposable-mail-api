class InvalidMailInboxRetreiveError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

module.exports = InvalidMailInboxRetreiveError;
