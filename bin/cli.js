#!/usr/bin/env node

const yargs = require('yargs');
const figlet = require('figlet');

const {DisposableMail} = require('../src/index');
const axios = require('axios');
const mail = new DisposableMail();
const PACKAGE_NAME = 'disposable-mail-api';

_banner();

const options = yargs.usage('Usage: -u <username>').options({
  u: {
    alias: 'username',
    describe: 'Your username for mail creation',
    type: 'string',
    demandOption: true,
  },
  s: {
    alias: 'skip',
    describe: 'Skip latest version check',
    type: 'boolean',
    demandOption: false,
    default: false,
  },
  y: {
    alias: 'yes',
    describe:
      'Default yes to all prompts. Currently only works for auto-update',
    type: 'boolean',
    demandOption: false,
    default: false,
  },
}).argv;

(async () => {
  if (!options.skip) {
    await checkForUpdates();
  }

  const createMail = await mail.generate({username: options.username});
  console.log(`Mail created => ${createMail.address}`);
  console.log('Listening for mails...');

  let counterMailsShowed = 0;
  setInterval(async () => {
    const getInboxMail = await mail.inbox();
    if (getInboxMail.mailInbox.length !== counterMailsShowed) {
      _displayMail(getInboxMail.mailInbox[0]);
      counterMailsShowed++;
    }
  }, 7000);
})();

function _displayMail(mail) {
  console.log(
      `---------------------------- NEW MAIL ----------------------------`
  );
  console.log(`>> From: ${mail.from.name} <${mail.from.address}>`);
  console.log(`>> Subject: ${mail.subject}`);
  console.log(`>> Intro: ${mail.intro}`);
  console.log(`>> Body: ${mail.text}`);
}

function _banner() {
  figlet('Disposable Mail', {font: '3D Diagonal'}, (err, data) =>
    console.log(data)
  );
}

// Auto update stuff

function newVersionBanner(currentVersion, latestVersion, string = null) {
  const strings = [
    string ||
      `| New version available: ${currentVersion} => ${latestVersion} |`,
    '\x1b[31m',
    `| Please run 'npm i ${PACKAGE_NAME}@latest -g' |`,
    '\x1b[0m',
  ];
  const maxStringLength = Math.max(...strings.map((s) => s.length));

  console.log(
      '-'.repeat(maxStringLength),
      strings.join('\n'),
      '-'.repeat(maxStringLength)
  );
}

// False is always No and Yes is always true
async function yesNoDialog(str, defaultAnswer = true) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const options = defaultAnswer ? '[Y/n]' : '[y/N]';
  const question = `${str} ${options} `;

  const answer = readline.question(question, (userAnswer) => {
    if (!userAnswer) {
      return defaultAnswer;
    }

    return userAnswer.toLowerCase().startsWith('y');
  });

  return answer;
}

// Helper function to reduce code complexity in the conditional
function checkShouldBeUpdated() {
  return (
    options.yes ||
    yesNoDialog(
        'New version available. Do you want to update to latest version?',
        false
    )
  );
}

function checkLatestVersion(localVersion, remoteVersion) {
  return localVersion.toString() !== remoteVersion.toString();
}

async function checkForUpdates() {
  const {version: localVersion} = require('../package.json');
  const NPM_REGISTRY_DATA = `https://registry.npmjs.org/${PACKAGE_NAME}/latest`;
  const {
    data: {version: remoteVersion},
  } = await axios.get(NPM_REGISTRY_DATA);

  const isLatestVersion = checkLatestVersion(localVersion, remoteVersion);

  if (isLatestVersion && checkShouldBeUpdated()) {
    autoUpdate(localVersion, remoteVersion);
  }

  if (isLatestVersion && !checkShouldBeUpdated()) {
    newVersionBanner(localVersion, remoteVersion);
  }
}

function autoUpdate(localVersion, remoteVersion) {
  const {execSync} = require('node:child_process');

  try {
    execSync(`npm i ${PACKAGE_NAME}@latest -g`);
  } catch (e) {
    newVersionBanner(
        localVersion,
        remoteVersion,
        `Error while updating ${PACKAGE_NAME}: Update manually`
    );
    return;
  }

  try {
    execSync(process.argv.join(' '));
    process.exit(0);
  } catch (error) {
    console.error(
        'Error while running updated version. Update manually or run with --skip option.'
    );
    process.exit(1);
  }
}
