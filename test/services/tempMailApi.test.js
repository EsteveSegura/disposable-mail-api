const tempMailTest = require('../../src/service/tempMailApi');
const axios = require('axios');
const InvalidMailInboxRetreiveError = require('../../src/errors/InvalidMailInboxRetreiveError');
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
          .mockReturnValueOnce({
            data: {
              'hydra:member': [{domain: 'patata.net'}],
            },
          });
      axios.post
          .mockReturnValueOnce({
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


    it('should retreive new mail inbox', async () => {
      axios.post
          .mockReturnValueOnce({
            data: {
              token: 'GOAL',
            },
          });
      axios.get
          .mockReturnValueOnce({
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
      axios.post.mockRejectedValueOnce(new Error());


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

    it('should throw err if token is not valid', async () => {
      axios.post
          .mockReturnValueOnce({
            data: {
              token: 'GOAL',
            },
          });

      axios.get.mockRejectedValueOnce(new Error());


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
