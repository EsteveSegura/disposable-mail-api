const {DisposableMail} = require('../src/index');
const mail = new DisposableMail();

(async () => {
  const createMail = await mail.generate({mail: null});
  console.log('createMail', createMail);

  setInterval(async () => {
    const getInboxMail = await mail.inbox();
    console.log('getInboxMail', getInboxMail);
  }, 7000);
})();

