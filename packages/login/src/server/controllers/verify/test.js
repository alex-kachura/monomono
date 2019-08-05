describe('Verify controller', () => {
  let controller;

  let result;

  let mockHandshake;

  let mockElevateToken;
  const mockAccessToken = 'mock-token';
  const mockContext = 'mock-context';
  const mockTracer = 'mock-tracer';
  const mockNewToken = 'mock-new-token';
  const mockNewRefresh = 'mock-new-refresh-token';
  const mockExpiresIn = 'mock-expiresin';
  const mockClaims = 'mock-claims';
  const mockFields = 'mock-fields';
  const mockStateToken = 'mock-state-token';
  const MockServiceError = {
    Codes: {
      ACCOUNT_LOCKED_ONE_HOUR: 'ACCOUNT_LOCKED_ONE_HOUR',
    },
  };

  let mockLogError;

  let mockLogWarn;

  beforeEach(() => {
    mockLogError = jest.fn();
    mockLogWarn = jest.fn();
    mockHandshake = jest.fn();
    mockElevateToken = jest.fn();

    jest.doMock('@web-foundations/service-identity', () => ({
      IdentityServiceError: MockServiceError,
    }));
    jest.doMock('../../services/identity', () => ({
      handshake: mockHandshake,
      elevateToken: mockElevateToken,
    }));
    jest.doMock('../../logger', () => ({
      error: mockLogError,
      warn: mockLogWarn,
    }));
  });

  afterEach(() => {
    jest.resetModules();
    mockHandshake.mockClear();
    mockElevateToken.mockClear();
    mockLogError.mockClear();
    mockLogWarn.mockClear();
  });

  describe('#handshake', () => {
    describe('success', () => {
      beforeEach(async () => {
        mockHandshake.mockReturnValue(
          Promise.resolve({
            access_token: mockNewToken, // eslint-disable-line camelcase
            refresh_token: mockNewRefresh, // eslint-disable-line camelcase
            expires_in: mockExpiresIn, // eslint-disable-line camelcase
            Claims: mockClaims,
          }),
        );

        controller = require('.');

        result = await controller.handshake({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should call identity handshake', () => {
        expect(mockHandshake).toHaveBeenCalledWith({
          targetConfidence: 16,
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should return new tokens', () => {
        expect(result).toEqual({
          authenticated: {
            accessToken: mockNewToken,
            refreshToken: mockNewRefresh,
            expires: mockExpiresIn,
            claims: mockClaims,
          },
        });
      });
    });

    describe('verification required', () => {
      beforeEach(async () => {
        mockHandshake.mockReturnValue(
          Promise.resolve({
            primary: {
              fields: mockFields,
            },
            state: mockStateToken,
          }),
        );

        controller = require('.');

        result = await controller.handshake({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should return fields and state token', () => {
        expect(result).toEqual({
          challenge: {
            fields: mockFields,
            stateToken: mockStateToken,
          },
        });
      });
    });

    describe('service error', () => {
      const mockError = new Error('mock error');

      beforeEach(async () => {
        mockHandshake.mockReturnValue(Promise.reject(mockError));

        controller = require('.');

        result = await controller.handshake({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should log error', () => {
        expect(mockLogError).toHaveBeenCalledWith(
          'error doing level 16 handshake',
          mockError,
          mockContext,
        );
      });

      it('should return error object', () => {
        expect(result).toEqual({
          error: mockError,
        });
      });
    });

    describe('unknown response', () => {
      beforeEach(async () => {
        mockHandshake.mockReturnValue(
          Promise.resolve({
            something: 'else',
          }),
        );

        controller = require('.');

        result = await controller.handshake({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should return error object', () => {
        expect(result).toEqual({
          error: new Error('Expected response from Identity'),
        });
      });
    });
  });

  describe('#elevateToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        mockElevateToken.mockReturnValue(
          Promise.resolve({
            access_token: mockNewToken, // eslint-disable-line camelcase
            refresh_token: mockNewRefresh, // eslint-disable-line camelcase
            expires_in: mockExpiresIn, // eslint-disable-line camelcase
            Claims: mockClaims,
          }),
        );

        controller = require('.');

        result = await controller.elevateToken({
          fields: mockFields,
          stateToken: mockStateToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should call identity elevateToken', () => {
        expect(mockElevateToken).toHaveBeenCalledWith({
          stateToken: mockStateToken,
          clubcardFields: mockFields,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should return new tokens', () => {
        expect(result).toEqual({
          authenticated: {
            accessToken: mockNewToken,
            refreshToken: mockNewRefresh,
            expires: mockExpiresIn,
            claims: mockClaims,
          },
        });
      });
    });

    describe('verification required', () => {
      beforeEach(async () => {
        mockElevateToken.mockReturnValue(
          Promise.resolve({
            primary: {
              fields: mockFields,
            },
            state: mockStateToken,
          }),
        );

        controller = require('.');

        result = await controller.elevateToken({
          fields: mockFields,
          stateToken: mockStateToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should return fields and state token', () => {
        expect(result).toEqual({
          challenge: {
            fields: mockFields,
            stateToken: mockStateToken,
          },
        });
      });
    });

    describe('account locked error', () => {
      const mockError = new Error(MockServiceError.Codes.ACCOUNT_LOCKED_ONE_HOUR);

      beforeEach(async () => {
        mockElevateToken.mockReturnValue(Promise.reject(mockError));

        controller = require('.');

        result = await controller.elevateToken({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should log warning', () => {
        expect(mockLogWarn).toHaveBeenCalledWith(
          'max tries reached, account locked',
          mockError,
          mockContext,
        );
      });

      it('should return accountLocked = true', () => {
        expect(result).toEqual({
          accountLocked: true,
        });
      });
    });

    describe('service error', () => {
      const mockError = new Error('some error from service');

      beforeEach(async () => {
        mockElevateToken.mockReturnValue(Promise.reject(mockError));

        controller = require('.');

        result = await controller.elevateToken({
          accessToken: mockAccessToken,
          context: mockContext,
          tracer: mockTracer,
        });
      });

      it('should log error', () => {
        expect(mockLogError).toHaveBeenCalledWith(
          'error elevating user token',
          mockError,
          mockContext,
        );
      });

      it('should return error object', () => {
        expect(result).toEqual({
          error: mockError,
        });
      });
    });
  });
});
