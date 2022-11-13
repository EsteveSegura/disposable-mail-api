class InvalidDomainEmailRetireveError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

module.exports = InvalidDomainEmailRetireveError;
