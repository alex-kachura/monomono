describe('Claims middleware', () => {
  let mockExpress;
  let mockReq;
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
    mockReq = {
      region: 'gb',
    };
    mockExpress = {
      request: mockReq,
    };

    jest.doMock('express', () => mockExpress);
    jest.doMock('config', () => mockConfig);

    require('./');
  });

  afterEach(() => {
    jest.resetModules();
    Reflect.deleteProperty(require.cache, require.resolve('./')); // eslint-disable-line
  });

  it('should add a "getClaims" method to the response object', () => {
    expect(mockReq).toHaveProperty('getClaims');
    expect(typeof mockReq.getClaims).toBe('function');
  });

  describe('getClaims', () => {
    it('should return an object with an access token', () => {
      const accessToken = 'test';

      mockReq.cookies = {
        accessToken,
      };

      expect(mockReq.getClaims()).toHaveProperty('accessToken', accessToken);
    });

    it('should return an object with a UUID', () => {
      const uuid = 'uuid';

      mockReq.cookies = {
        uuid,
      };

      expect(mockReq.getClaims()).toHaveProperty('uuid', uuid);
    });
  });
});
