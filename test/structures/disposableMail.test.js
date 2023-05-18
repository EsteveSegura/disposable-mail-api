const DisposableMailTest = require('../../src/structures/disposableMail');


describe('DisposableMail', () => {
  let apiMailServiceMock = null;

  beforeEach(() => {
    apiMailServiceMock = {
      createMail: jest.fn(),
      getMailInbox: jest.fn(),
      getMailById: jest.fn(),
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

  it('should read email inbox with specific address and password and return body with html', async () => {
    const disposableMailInstance = new DisposableMailTest(apiMailServiceMock);
    apiMailServiceMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});
    apiMailServiceMock.getMailInbox.mockReturnValue({
      'hydra:member': [
        {
          from: [{
            address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
            name: '',
          }],
          id: '123123123123',
          subject: 'important mail',
          intro: 'Hey! you should checkout this awesome website! https://girlazo.com/',
        },
      ],
    });
    apiMailServiceMock.getMailById.mockReturnValue({
      from: [{
        address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
        name: '',
      }],
      id: '123123123123',
      subject: 'important mail',
      text: 'Hey! you should checkout this awesome website! https://girlazo.com/',
      html: '<div>Hey! you should checkout this awesome website! https://girlazo.com/</div>',
    });

    const createdMail = await disposableMailInstance.generate({username: 'supermail', password: 'guardiasregladas'});
    const inboxMail = await disposableMailInstance.inbox({withHtml: true});

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
          intro: 'Hey! you should checko...',
          id: '123123123123',
          text: '<div>Hey! you should checkout this awesome website! https://girlazo.com/</div>',
          subject: 'important mail',
        },
      ],
    });
  });

  it('should read email inbox with specific address and password and return body without html', async () => {
    const disposableMailInstance = new DisposableMailTest(apiMailServiceMock);
    apiMailServiceMock.createMail.mockReturnValue({address: 'supermail@kerenkey.com'});
    apiMailServiceMock.getMailInbox.mockReturnValue({
      'hydra:member': [
        {
          from: [{
            address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
            name: '',
          }],
          id: '123123123123',
          subject: 'important mail',
          intro: 'Hey! you should checkout this awesome website! https://girlazo.com/',
        },
      ],
    });
    apiMailServiceMock.getMailById.mockReturnValue({
      from: [{
        address: 'd0f11334fd10abedc6276e6677d8c3@karenkey.com',
        name: '',
      }],
      id: '123123123123',
      subject: 'important mail',
      text: 'Hey! you should checkout this awesome website! https://girlazo.com/',
      html: '<div>Hey! you should checkout this awesome website! https://girlazo.com/</div>',
    });

    const createdMail = await disposableMailInstance.generate({username: 'supermail', password: 'guardiasregladas'});
    const inboxMail = await disposableMailInstance.inbox({withHtml: false});

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
          intro: 'Hey! you should checko...',
          id: '123123123123',
          text: '<div>Hey! you should checkout this awesome website! https://girlazo.com/</div>',
          subject: 'important mail',
        },
      ],
    });
  });
});
