describe('Claims middleware', () => {
  const request = { region: 'gb' };
  const mockExpress = { request };

  const mockConfig = {
    cookie: {
      userAccessToken: {
        name: 'accessToken',
      },
      UUID: {
        name: 'uuid',
      },
    },
  };

  beforeEach(() => {
    jest.doMock('express', () => mockExpress);
    jest.doMock('config', () => mockConfig);

    require('./');
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should add a "getClaims" method to the response object', () => {
    expect(request).toHaveProperty('getClaims');
    expect(typeof request.getClaims).toBe('function');
  });

  describe('getClaims', () => {
    it('should return an object with an access token and UUID', () => {
      const accessToken = 'test';
      const uuid = 'uuid';

      request.cookies = {
        accessToken,
        uuid,
      };

      expect(request.getClaims()).toEqual({
        accessToken,
        uuid,
      });
    });
  });
});
