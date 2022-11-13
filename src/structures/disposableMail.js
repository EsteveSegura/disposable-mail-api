const {randomString} = require('../utils/randomString');

const InboxResponse = require('../responses/InboxResponse');
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

    const response = new GenerateResponse({address: createdMail.address});
    return response;
  }

  async inbox() {
    const inbox = await this.apiMailService.getMailInbox({
      mail: this.mail,
      password: this.password,
    });

    const response = new InboxResponse({inbox: inbox['hydra:member']});
    return response;
  };
}

module.exports = DisposableMail;
