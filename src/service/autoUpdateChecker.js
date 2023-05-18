import { ynInKey } from '../utils/ynInKey';
import { getVersions } from './getVersions';

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

function update(packageName) {
  const {execSync} = require('child_process');
  const command = `npm i ${packageName}@latest -g`;
  console.log(`Running '${command}'...`);
  execSync(command, {stdio: 'inherit'});
  console.log('Done!');

  execSync(process.argv.join(' '), {stdio: 'inherit'});
  process.exit(0);
}

export function autoUpdateChecker() {
  const {localVersion, latestVersion, packageName} = getVersions();
  if (localVersion === latestVersion) return;

  newVersionBanner(localVersion, latestVersion);

  ynInKey('Do you want to update now?').then(() => update(packageName)).catch(() => {});
}
