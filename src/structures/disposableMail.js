const apiMailService = require('../service/tempMailApi');
const {randomString} = require('../utils/randomString');

class DisposableMail {
  constructor() {
    this.mail = null;
    this.password = null;
  }

  async generate({mail = null, password = null}) {
    this.mail = mail;

    if (!this.mail) {
      this.mail = randomString({length: 15});
    }

    this.password = password;

    if (!this.password) {
      this.password = randomString({length: 25});
    }

    const createdMail = await apiMailService.createMail({
      mail: this.mail,
      password: this.password
    });

    // TODO: Move return to ValueObject
    return {
      addres: createdMail.address,
    };
  }

  async inbox() {
    const inbox = await apiMailService.getMailInbox({
      mail: this.mail,
      password: this.password
    });

    // TODO: Move return to ValueObject
    return {
      mailInbox: inbox['hydra:member'].map((mail) => ({
        from: mail.from,
        subject: mail.subject,
        intro: mail.intro,
      })),
    };
  }
}

module.exports = DisposableMail;
