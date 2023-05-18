const {ynInKey} = require('../utils/ynInKey');
const {getVersions} = require('./getVersions');
const {name: PACKAGE_NAME} = require('../../package.json');

function newVersionBanner(currentVersion, latestVersion, string = null) {
  const strings = [
    `New version available: ${currentVersion} => ${latestVersion}`,
    `Please run 'npm i ${PACKAGE_NAME}@latest -g'`,
  ];

  const maxStringLength = Math.max(...strings.map((s) => s.length));
  const repeatLength = maxStringLength + 2;
  const pattern = '-'.repeat(repeatLength);
  const formattedStrings = strings.map((s) => s.padEnd(maxStringLength));
  formattedStrings.unshift(' '.repeat(maxStringLength));
  formattedStrings.push(' '.repeat(maxStringLength));

  console.log(
      `\n\t ${pattern}\n\t|`,
      formattedStrings.join(' |\n\t| '),
      `|\n\t ${pattern}`,
      '\n'
  );
}

function update() {
  const {execSync} = require('child_process');
  const command = `npm i ${PACKAGE_NAME}@latest -g`;
  console.log(`Running '${command}'...`);
  execSync(command, {stdio: 'inherit'});
  console.log('Done!');

  execSync(process.argv.join(' '), {stdio: 'inherit'});
  process.exit(0);
}

async function autoUpdateChecker() {
  try {
    const {localVersion, latestVersion} = await getVersions();
    if (localVersion === latestVersion) return;

    newVersionBanner(localVersion, latestVersion);

    await ynInKey('Do you want to update now?', false).then(() => update());
  } catch (error) {}
}

module.exports ={autoUpdateChecker};
