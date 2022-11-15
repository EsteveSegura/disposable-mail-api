const DisposableMailTest = require('../../src/structures/disposableMail');


describe('DisposableMail', () => {
  let apiMailServiceMock = null;

  beforeEach(() => {
    apiMailServiceMock = {
      createMail: jest.fn(),
      getMailInbox: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create email with specific address and password', async () => {
    const disposableMailInstance = new DisposableMailTest(apiMailServiceMock);
    apiMailServiceMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});

    const createdMail = await disposableMailInstance.generate({username: 'supermail', password: 'guardiasregladas'});

    expect(apiMailServiceMock.createMail).toHaveBeenCalledTimes(1);
    expect(apiMailServiceMock.createMail).toHaveBeenCalledWith({username: 'supermail', password: 'guardiasregladas'});
    expect(createdMail).toEqual({address: 'supermail@kerenkey.com'});
  });

  it('should read email inbox with specific address and password', async () => {
    const disposableMailInstance = new DisposableMailTest(apiMailServiceMock);
    apiMailServiceMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});
    apiMailServiceMock.getMailInbox.mockReturnValue({
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

    const createdMail = await disposableMailInstance.generate({username: 'supermail', password: 'guardiasregladas'});
    const inboxMail = await disposableMailInstance.inbox();

    expect(apiMailServiceMock.createMail).toHaveBeenCalledTimes(1);
    expect(apiMailServiceMock.createMail).toHaveBeenCalledWith({username: 'supermail', password: 'guardiasregladas'});
    expect(apiMailServiceMock.getMailInbox).toHaveBeenCalledTimes(1);
    expect(apiMailServiceMock.getMailInbox).
        toHaveBeenCalledWith({mail: 'supermail@kerenkey.com', password: 'guardiasregladas'});
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
