const htmlStripper = require('string-strip-html');

class InboxResponseWithoutrHtmlResponse {
  constructor({inbox}) {
    this.mailInbox = inbox.map((mail) => ({
      id: mail.id,
      from: mail.from,
      subject: mail.subject,
      intro: mail.text.length > 25 ? mail.text.substring(0, (25 - 3)) + '...' : mail.text,
      text: Array.isArray(mail.html) ? htmlStripper.stripHtml(mail.html.join('')).result : mail.html,
    }));
  }
}

module.exports = InboxResponseWithoutrHtmlResponse;
