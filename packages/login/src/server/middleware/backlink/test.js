describe('Backlink middleware', () => {
  let middleware;
  let mockReq;
  let mockRes;
  let mockNext;
  let mockConfig;
  let getBacklinkLabel;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      data: {
        onwardLocation:
          'https%3A%2F%2Fwww-local.tesco.com%2Faccount%2Faddress-book%2Fen-GB%2Fedit-clubcard-address%2F%3Fid%3DNGC_0',
      },
    };

    mockConfig = {
      get: (configValue) =>
        configValue === 'languages.default' ? 'en-GB' : { en: [{ label: 'Address Book' }] },
    };

    jest.doMock('config', () => mockConfig);
    middleware = require('./').default;
    getBacklinkLabel = require('./').getBacklinkLabel;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should export a function', () => {
    expect(typeof middleware === 'function').toBe(true);
  });

  describe('valid backlink', () => {
    beforeEach(() => {
      mockReq = {
        get: () => 'https://www.tesco.com/groceries',
        locale: {
          language: 'en',
        },
      };
    });

    it('should set the backlink within response data', () => {
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.data.backlink).toEqual({
        link: 'https://www-local.tesco.com/account/address-book/en-GB/',
        label: 'Address Book',
      });
    });
  });

  describe('"getBacklinkLabel()"', () => {
    beforeEach(() => {
      mockReq = {
        get: () => 'www.tesco.com/groceries',
        locale: {
          language: 'en',
        },
      };
    });

    it('should set the default label if no sanitised backlink', () => {
      const backUrls = { en: [{ url: 'tesco.com/wine', label: 'back-to.wine' }] };
      const backlink = false;
      const language = 'en';
      const result = getBacklinkLabel(backUrls, backlink, language);

      expect(result).toEqual('back-to.default');
    });
  });
});
