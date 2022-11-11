const DisposableMailTest = require('../../src/structures/disposableMail');


describe('DisposableMail', () => {
  let httpClientMock = null;

  beforeEach(() => {
    httpClientMock = {
      createMail: jest.fn(),
      getMailInbox: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create email with specific address and password', async () => {
    const disposableMailInstance = new DisposableMailTest(httpClientMock);
    httpClientMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});

    const createdMail = await disposableMailInstance.generate({mail: 'supermail', password: 'guardiasregladas'});

    expect(httpClientMock.createMail).toHaveBeenCalledTimes(1);
    expect(httpClientMock.createMail).toHaveBeenCalledWith({mail: 'supermail', password: 'guardiasregladas'});
    expect(createdMail).toEqual({address: 'supermail@kerenkey.com'});
  });

  it('should read email inbox with specific address and password', async () => {
    const disposableMailInstance = new DisposableMailTest(httpClientMock);
    httpClientMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});
    httpClientMock.getMailInbox.mockReturnValue({
      'hydra:member': [
        {
          from: [{
            address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
            name: '',
          }],
          subject: 'important mail',
          intro: 'Hey! you should checkout this awesome website! https://girlazo.com/',
        },
      ],
    });

    const createdMail = await disposableMailInstance.generate({mail: 'supermail', password: 'guardiasregladas'});
    const inboxMail = await disposableMailInstance.inbox();

    expect(httpClientMock.createMail).toHaveBeenCalledTimes(1);
    expect(httpClientMock.createMail).toHaveBeenCalledWith({mail: 'supermail', password: 'guardiasregladas'});
    expect(httpClientMock.getMailInbox).toHaveBeenCalledTimes(1);
    expect(httpClientMock.getMailInbox).toHaveBeenCalledWith({mail: 'supermail', password: 'guardiasregladas'});
    expect(createdMail).toEqual({address: 'supermail@kerenkey.com'});
    expect(inboxMail).toEqual({
      mailInbox: [
        {
          from: [
            {
              address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
              name: '',
            },
          ],
          intro: 'Hey! you should checkout this awesome website! https://girlazo.com/',
          subject: 'important mail',
        },
      ],
    });
  });
});
