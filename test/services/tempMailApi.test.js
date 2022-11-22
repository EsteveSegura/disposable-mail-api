const tempMailTest = require('../../src/service/tempMailApi');
const axios = require('axios');
const InvalidMailInboxRetreiveError = require('../../src/errors/InvalidMailInboxRetreiveError');
const InvalidMailCreationError = require('../../src/errors/InvalidMailCreationError');
jest.mock('axios');

describe('TempMail', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('tempMailApi', () => {
    it('should create new mail inbox', async () => {
      axios.get
          .mockReturnValue({
            data: {
              'hydra:member': [{domain: 'patata.net'}],
            },
          });
      axios.post
          .mockReturnValue({
            data: {},
          });

      await tempMailTest.createMail({username: 'enElSiguientePr', password: '1111'});

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/domains');
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/accounts', {
        address: 'enElSiguientePr@patata.net',
        password: '1111',
      });
    });

    it('should throw err if domain is null or cannot retrieve it', async () => {
      axios.get.mockRejectedValue(new Error());
      try {
        await tempMailTest.createMail({username: 'enElSiguientePr', password: '1111'});
      } catch (error) {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/domains');

        expect(error).toBeInstanceOf(InvalidMailCreationError);
        expect(error.message).toEqual('Cant create new mail.');
      }
    });


    it('should throw err if domain/username or credetials are not valid', async () => {
      axios.get
          .mockReturnValue({
            data: {
              'hydra:member': [{domain: 'patata.net'}],
            },
          });

      axios.post.mockRejectedValue(new Error());
      try {
        await tempMailTest.createMail({username: 'enElSiguientePr', password: '1111'});
      } catch (error) {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/domains');
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/accounts', {
          address: 'enElSiguientePr@patata.net',
          password: '1111',
        });
        expect(error).toBeInstanceOf(InvalidMailCreationError);
        expect(error.message).toEqual('Cant create new mail.');
      }
    });

    it('should throw err if username is already on use', async () => {
      axios.get
          .mockReturnValue({
            data: {
              'hydra:member': [{domain: 'patata.net'}],
              'hydra:description': {'address': 'The username PaquitoEstaPR is not valid'},
            },
          });

      axios.post.mockRejectedValue({
        response: {
          data:
          {
            'hydra:description': 'address: This value is already used.',
          },
        },
      });

      try {
        await tempMailTest.createMail({username: 'PaquitoEstaPR', password: '1111'});
      } catch (error) {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/domains');
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/accounts', {
          address: 'PaquitoEstaPR@patata.net',
          password: '1111',
        });
        expect(error).toBeInstanceOf(InvalidMailCreationError);
        expect(error.message).toEqual('This username is already taken by other user');
      }
    });


    it('should retreive new mail inbox', async () => {
      axios.post
          .mockReturnValue({
            data: {
              token: 'GOAL',
            },
          });
      axios.get
          .mockReturnValue({
            data: {something: 'beacause im and object in js :D'},
          });

      await tempMailTest.getMailInbox({mail: 'enElSiguientePr@patata.net', password: '1111'});

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/messages', {
        headers: {
          authorization: 'Bearer GOAL',
        },
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/token', {
        address: 'enElSiguientePr@patata.net',
        password: '1111',
      });
    });


    it('should throw err if cant retrieve email inbox if mail and password are incorrect', async () => {
      axios.post.mockRejectedValue(new Error());


      try {
        await tempMailTest.getMailInbox({mail: 'enElSiguientePr@patata.net', password: '1111'});
      } catch (error) {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(0);
        expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/token', {
          address: 'enElSiguientePr@patata.net',
          password: '1111',
        });
        expect(error).toBeInstanceOf(InvalidMailInboxRetreiveError);
        expect(error.message).toEqual('Cant get the inbox.');
      }
    });

    it('should throw err if token is not valid when gettingMailInbox', async () => {
      axios.post
          .mockReturnValue({
            data: {
              token: 'GOAL',
            },
          });

      axios.get.mockRejectedValue(new Error());


      try {
        await tempMailTest.getMailInbox({mail: 'enElSiguientePr@patata.net', password: '1111'});
      } catch (error) {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith('https://api.mail.tm/token', {
          address: 'enElSiguientePr@patata.net',
          password: '1111',
        });
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('https://api.mail.tm/messages', {
          headers: {
            authorization: 'Bearer GOAL',
          },
        });

        expect(error).toBeInstanceOf(InvalidMailInboxRetreiveError);
        expect(error.message).toEqual('Cant get the inbox.');
      }
    });
  });
});
