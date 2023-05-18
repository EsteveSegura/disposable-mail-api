export async function getVersions() {
  const {
    version: localVersion,
    name,
  } = require('../package.json');
  const npmRegistryUrlForThisPackage = `https://registry.npmjs.org/${name}/latest`;
  const {
    data: {version: latestVersion},
  } = require('axios').get(npmRegistryUrlForThisPackage);

  return {localVersion, latestVersion, packageName: name};
}
