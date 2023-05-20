const {version: LOCAL_VERSION, name} = require('../../package.json');

async function getVersions() {
  const npmRegistryUrlForThisPackage = `https://registry.npmjs.org/${name}/latest`;
  const {
    data: {version: latestVersion},
  } = require('axios').get(npmRegistryUrlForThisPackage);

  return {localVersion: LOCAL_VERSION, latestVersion};
}

module.exports = {getVersions};
