import config from 'config';

describe('Backlink middleware', () => {
  let middleware;

  let mockReq;

  let mockRes;

  let mockNext;

  let getBacklink;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      data: {
        onwardLocation:
          'https%3A%2F%2Fwww-local.tesco.com%2Faccount%2Faddress-book%2Fen-GB%2Fedit-clubcard-address%2F%3Fid%3DNGC_0',
      },
    };

    middleware = require('./').default;
    getBacklink = require('./').getBacklink;
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
        region: 'GB',
      };
    });

    it('should set the backlink within response data', () => {
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.data.backlink).toEqual({
        link: 'https://www-local.tesco.com/account/address-book/en-GB',
        label: 'back-to.address-book',
      });
    });
  });

  describe('"getBacklinkLabel()"', () => {
    beforeEach(() => {
      mockReq = {
        region: 'GB',
      };
    });

    it('should set the default label if no sanitised backlink', () => {
      const backUrls = config.GB.backToWhitelist;
      const defaultBackLink = {
        label: 'back-to.default',
        link: config.GB.externalApps.tescoHomepage,
      };
      const result = getBacklink(backUrls, '', defaultBackLink);

      expect(result).toEqual({ label: 'back-to.default', link: 'https://www-local.tesco.com' });
    });
  });
});
