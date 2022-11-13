class InboxResponse {
  constructor({inbox}) {
    this.mailInbox = inbox.map((mail) => ({
      from: mail.from,
      subject: mail.subject,
      intro: mail.intro,
    }));
  }
}

module.exports = InboxResponse;
