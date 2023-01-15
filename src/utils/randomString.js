function randomString({length = 9}) {
  const generateRandomString = [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  return generateRandomString;
}

module.exports = {randomString};
