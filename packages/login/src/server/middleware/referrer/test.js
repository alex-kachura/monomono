import Immutable from 'immutable';

describe('Referrer middleware', () => {
  let middleware;
  let mockReq;
  let mockRes;
  let mockNext;
  let mockConfig;
  let getReferrerLabel;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      data: new Immutable.Map(),
    };

    mockConfig = {
      get: (configValue) =>
        configValue === 'languages.default' ? 'en-GB' : { en: [{ label: 'back-to.direct' }] },
    };

    jest.doMock('config', () => mockConfig);
    middleware = require('./').default;
    getReferrerLabel = require('./').getReferrerLabel;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should export a function', () => {
    expect(typeof middleware === 'function').toBe(true);
  });

  describe('valid referrer', () => {
    beforeEach(() => {
      mockReq = {
        get: () => 'https://www.tesco.com/direct',
        locale: {
          language: 'en',
        },
      };
    });

    it('should set the referrer within response data', () => {
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.data.toJS().referrer).toEqual({
        link: 'https://www.tesco.com/direct',
        label: 'back-to.direct',
      });
    });
  });

  describe('referrer from url query', () => {
    beforeEach(() => {
      mockReq = {
        get: () => '',
        locale: {
          language: 'en',
        },
        query: {
          referrer: 'https%3A%2F%2Fwww.tesco.com%2Fgroceries',
        },
      };
      mockConfig = {
        get: (configValue) =>
          configValue === 'languages.default' ? 'en-GB' : { en: [{ label: 'back-to.groceries' }] },
      };

      jest.resetModules();
      jest.doMock('config', () => mockConfig);
      middleware = require('./').default;
    });

    it('should set the referrer within response data', () => {
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.data.toJS().referrer).toEqual({
        link: 'https://www.tesco.com/groceries',
        label: 'back-to.groceries',
      });
    });
  });

  describe('"getReferrerLabel()"', () => {
    beforeEach(() => {
      mockReq = {
        get: () => 'www.tesco.com/direct',
        locale: {
          language: 'en',
        },
      };
    });

    it('should set the default label if no sanitised referrer', () => {
      const backUrls = { en: [{ url: 'tesco.com/wine', label: 'back-to.wine' }] };
      const referrer = false;
      const language = 'en';
      const result = getReferrerLabel(backUrls, referrer, language);

      expect(result).toEqual('back-to.default');
    });
  });
});
