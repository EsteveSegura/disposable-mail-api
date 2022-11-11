const InvalidMailCreationError = require('../errors/InvalidMailCreationError');
const InvalidMailInboxRetreiveError = require('../errors/InvalidMailInboxRetreiveError');
const InvalidMailCredentialsError = require('../errors/InvalidMailCredentialsError');

class TemporalMailService {
  constructor() {
    this.BASE_API_URL = 'https://api.mail.tm';
    this.httpClient = require('axios');
  }
  async createMail({mail, password}) {
    try {
      const response = await this.httpClient.post(`${this.BASE_API_URL}/accounts`, {
        address: `${mail}@karenkey.com`,
        password,
      });

      return response.data;
    } catch (err) {
      throw new InvalidMailCreationError('Cant create new mail.');
    }
  }

  async getMailInbox({mail, password}) {
    try {
      const {token} = await this._getMailToken({mail, password});
      const response = await this.httpClient.get(`${this.BASE_API_URL}/messages`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      throw new InvalidMailInboxRetreiveError('Cant get the inbox.');
    }
  }

  async _getMailToken({mail, password}) {
    try {
      const response = await this.httpClient.post(`${this.BASE_API_URL}/token`, {
        address: `${mail}@karenkey.com`,
        password,
      });

      return response.data;
    } catch (err) {
      throw new InvalidMailCredentialsError('Cant obtain and process the credentials.');
    }
  }
}


module.exports = new TemporalMailService();
