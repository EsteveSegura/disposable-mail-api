const {randomString} = require('../utils/randomString');

const InboxResponse = require('../responses/InboxResponse');
const InboxWithoutHtmlResponse = require('../responses/InboxWithoutHtmlResponse');
const GenerateResponse = require('../responses/GenerateResponse');

class DisposableMail {
  constructor(apiMailService) {
    this.apiMailService = apiMailService || require('../service/tempMailApi');

    this.mail = null;
    this.username = null;
    this.password = null;
  }

  async generate({username = null, password = null}) {
    this.username = username;

    if (!this.username) {
      this.username = randomString({length: 15});
    }

    this.password = password;

    if (!this.password) {
      this.password = randomString({length: 25});
    }

    const createdMail = await this.apiMailService.createMail({
      username: this.username,
      password: this.password,
    });

    this.mail = createdMail.address;

    const response = new GenerateResponse({address: createdMail.address});
    return response;
  }

  async inbox({withHtml = true}) {
    const inbox = await this.apiMailService.getMailInbox({
      mail: this.mail,
      password: this.password,
    });

    const getAllMailIds = inbox['hydra:member'].map((mail) => mail.id);
    const currentInbox = [];

    for (const mailId of getAllMailIds) {
      const mail = await this.apiMailService.getMailById({
        mail: this.mail,
        password: this.password,
        id: mailId,
      });

      currentInbox.push(mail);
    }
    
    if (!withHtml) {
      const response = new InboxWithoutHtmlResponse({inbox: currentInbox});
      return response;
    }

    const response = new InboxResponse({inbox: currentInbox});
    return response;
  };
}

module.exports = DisposableMail;
