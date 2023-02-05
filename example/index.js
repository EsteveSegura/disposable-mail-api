const {DisposableMail} = require('../src/index');
const mail = new DisposableMail();

(async () => {
  const createMail = await mail.generate({username: null});
  console.log('createMail', createMail);

  setInterval(async () => {
    const getInboxMail = await mail.inbox({withHtml: false});
    console.log('InboxResponseWithoutrHtmlResponse', JSON.stringify(getInboxMail, null, 4));
  }, 7000);
})();
