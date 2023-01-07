class InboxResponse {
  constructor({inbox}) {
    this.mailInbox = inbox.map((mail) => ({
      from: mail.from,
      subject: mail.subject,
      intro: mail.text.length > 25 ? mail.text.substring(0, (25 - 3)) + '...' : mail.text,
      text: mail.text,
    }));
  }
}

module.exports = InboxResponse;
