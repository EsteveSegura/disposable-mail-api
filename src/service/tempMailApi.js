const InvalidMailCreationError = require('../errors/InvalidMailCreationError');
const InvalidMailInboxRetreiveError = require('../errors/InvalidMailInboxRetreiveError');
const InvalidMailCredentialsError = require('../errors/InvalidMailCredentialsError');
const InvalidDomainEmailRetireveError = require('../errors/InvalidDomainEmailRetrieveError');

class TemporalMailService {
  constructor(httpClient) {
    this.BASE_API_URL = 'https://api.mail.tm';
    this.httpClient = require('axios');
  }

  async createMail({username, password}) {
    try {
      const responseDomain = await this._getDomain();
      const domain = responseDomain['hydra:member'][0].domain;

      const response = await this.httpClient.post(`${this.BASE_API_URL}/accounts`, {
        address: `${username}@${domain}`,
        password,
      });

      return response.data;
    } catch (err) {
      if (err.response.data['hydra:description'].startsWith('address: The username') &&
      err.response.data['hydra:description'].endsWith('is not valid.')) {
        throw new InvalidMailCreationError('This username is already taken by other user');
      }

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
        address: mail,
        password,
      });

      return response.data;
    } catch (err) {
      throw new InvalidMailCredentialsError('Cant obtain and process the credentials.');
    }
  }

  async _getDomain() {
    try {
      const response = await this.httpClient.get(`${this.BASE_API_URL}/domains`);
      return response.data;
    } catch (err) {
      throw new InvalidDomainEmailRetireveError('Cant retrieve domain for emails');
    }
  }
}


module.exports = new TemporalMailService();

