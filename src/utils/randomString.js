const crypto = require('crypto');

function randomString({length = 9}) {
  const generateRandomString = crypto.randomBytes(length).toString('hex');
  return generateRandomString;
}

module.exports = {randomString};
