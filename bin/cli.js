#!/usr/bin/env node

const yargs = require('yargs');
const figlet = require('figlet');

const { DisposableMail } = require('../src/index');
const axios = require('axios');
const { version } = require('../package.json');
const mail = new DisposableMail();

_banner();

const options = yargs
  .usage('Usage: -u <username>')
  .option('u', { alias: 'username', describe: 'Your username for mail creation', type: 'string', demandOption: true })
  .option('html',
    { describe: 'Displays mail with plain html', type: 'boolean', demandOption: false, default: false })
  .argv;

(async () => {
  const { data: { version: remoteVersion } } = await axios
    .get('https://raw.githubusercontent.com/EsteveSegura/disposable-mail-api/main/package.json');
  checkForUpdates(version, remoteVersion);

  const createMail = await mail.generate({ username: options.username });
  console.log(`Mail created => ${createMail.address}`);
  console.log('Listening for mails...');


  let counterMailsShowed = 0;
  setInterval(async () => {
    const getInboxMail = await mail.inbox({ withHtml: options?.html });
    if (getInboxMail.mailInbox.length !== counterMailsShowed) {
      _displayMail(getInboxMail.mailInbox[0]);
      counterMailsShowed++;
    }
  }, 7000);
})();

function _displayMail(mail) {
  console.log(`---------------------------- NEW MAIL ----------------------------`);
  console.log(`>> From: ${mail.from.name} <${mail.from.address}>`);
  console.log(`>> Subject: ${mail.subject}`);
  console.log(`>> Intro: ${mail.intro}`);
  console.log(`>> Body: ${mail.text}`);
}

function _banner() {
  figlet('Disposable Mail', { font: '3D Diagonal' }, (_, data) => console.log(data));
}

function checkForUpdates(localVersion, remoteVersion) {
  if (localVersion.toString() !== remoteVersion.toString()) {
    console.log('New version available, please run:', '\x1b[31m', '\'npm i disposable-mail-api@latest -g\'', '\x1b[0m');
  }
}
