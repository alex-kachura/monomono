describe('[Utility: Identity service]', () => {
  const mockReq = {
    sessionId: '1234',
  };
  let MockedIdentity;
  let identityService;

  beforeEach(() => {
    const mockedLogger = {
      makeOnRequestEventHandler: jest.fn(),
    };
    const mockedConfig = {
      get: (key) => key,
    };

    MockedIdentity = class {
      async getClaims() {
        return Promise.resolve({ access_token: '1234-5678' }); // eslint-disable-line
      }
      on = jest.fn(); // eslint-disable-line
      // eslint-disable-next-line
      static OAuthTokenScopes = {
        SERVICE: 'service',
      };
    };

    jest.doMock('@web-foundations/service-identity', () => MockedIdentity);
    jest.doMock('config', () => mockedConfig);
    jest.doMock('../../logger', () => mockedLogger);

    identityService = require('./'); // eslint-disable-line
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('[Export: default]', () => {
    it('should export an Identity service client instance', () => {
      expect(identityService.default).toBeInstanceOf(MockedIdentity);
    });

    it('should set up a request start logger', () => {
      expect(identityService.default.on).toHaveBeenCalledWith('requestStart', undefined);
    });

    it('should set up a request end logger', () => {
      expect(identityService.default.on).toHaveBeenCalledWith('requestEnd', undefined);
    });
  });

  describe('[Export: getServiceToken]', () => {
    it('returns an access token', async () => {
      const result = await identityService.getServiceToken({
        tracer: mockReq.sessionId,
      });

      expect(result).toEqual('1234-5678');
    });
  });
});
