import config from 'config';

describe('[Route: /verify]', () => {
  let result;
  const mockError = 'mock-error';
  const mockTracer = 'mock-tracer';
  const mockUpdated = 'mock-updated';
  const mockLang = 'mock-lang';
  const mockRegion = 'GB';
  const mockAccessToken = 'mock-token';
  const mockStateToken = 'mock-state-token';
  const { schema } = config[mockRegion];

  let mockRedirect = jest.fn();
  const mockBody = {
    digit11: '3',
    digit12: '3',
    digit13: '3',
    state: mockStateToken,
  };
  const req = {
    sessionId: mockTracer,
    query: {
      updated: mockUpdated,
    },
    getLocalePhrase: (key) => key,
    lang: mockLang,
    region: mockRegion,
    body: mockBody,
  };

  let res;

  let next;

  let mockLogger;

  let mockControllerFactory;

  let mockGetClaims;
  const mockAuthenticated = 'mock-authenticated';
  const mockResponse = 'mock-response';
  const mockFields = [
    {
      id: 'digit11',
    },
    {
      id: 'digit12',
    },
    {
      id: 'digit13',
    },
  ];
  const mockRequiredFields = ['digit11', 'digit12', 'digit13'];
  let mockSetAuthCookies;

  let mockGetPhraseFactory;

  let mockGetLocalePhrase;

  function mockImports() {
    next = jest.fn(() => mockResponse);
    mockSetAuthCookies = jest.fn(() => mockResponse);
    mockGetLocalePhrase = jest.fn((key) => key);
    mockGetPhraseFactory = jest.fn(() => mockGetLocalePhrase);

    jest.doMock('../../logger', () => ({ logOutcome: mockLogger }));
    jest.doMock('./utils', () => ({
      mapPayloadToFields: jest.requireActual('./utils').mapPayloadToFields,
      mapValuesToPayload: jest.requireActual('./utils').mapValuesToPayload,
      setAuthCookies: mockSetAuthCookies,
    }));
    jest.doMock('../../controllers', () => mockControllerFactory);
    jest.doMock('../../utils/i18n', () => ({
      getPhraseFactory: mockGetPhraseFactory,
    }));
  }

  afterEach(() => {
    next.mockClear();
    mockLogger.mockClear();
    mockRedirect.mockClear();
    jest.resetModules();
  });

  describe('[GET]', () => {
    let getVerifyPage;

    let mockHandshake;

    beforeEach(() => {
      mockRedirect = jest.fn(() => mockResponse);
      mockHandshake = jest.fn().mockResolvedValueOnce({
        error: undefined,
        challenge: {
          stateToken: mockStateToken,
          fields: mockFields,
        },
        authenticated: false,
      });
      mockControllerFactory = jest.fn(() => ({
        handshake: mockHandshake,
      }));
      mockLogger = jest.fn();
      mockGetClaims = jest.fn(() => ({ accessToken: mockAccessToken }));
      req.getClaims = mockGetClaims;
      res = {
        data: {
          foo: 'bar',
        },
        redirect: mockRedirect,
        isMobile: false,
      };
    });

    describe('authenticated', () => {
      beforeEach(async () => {
        mockImports();

        mockHandshake.mockReturnValue(
          Promise.resolve({
            authenticated: mockAuthenticated,
          }),
        );

        getVerifyPage = require('./').getVerifyPage;

        result = await getVerifyPage(req, res, next);
      });

      it('should call controllerFactory correctly', () => {
        expect(mockControllerFactory).toHaveBeenCalledWith('verify', mockRegion);
      });

      it('should call getClaims', () => {
        expect(mockGetClaims).toHaveBeenCalledWith();
      });

      it('should call handshake', () => {
        expect(mockHandshake).toHaveBeenCalledWith({
          accessToken: mockAccessToken,
          context: req,
          tracer: mockTracer,
        });
      });

      it('should log the outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:get', 'successful-user-already-16', req);
      });

      it('should call setAuthCookies utility', () => {
        expect(mockSetAuthCookies).toHaveBeenCalledWith(req, res, mockAuthenticated);
      });

      it('should redirect to login', () => {
        expect(mockRedirect).toHaveBeenCalledWith(config[mockRegion].externalApps.login);
      });

      it('should return redirect', () => {
        expect(result).toEqual(mockResponse);
      });
    });

    describe('challenge', () => {
      beforeEach(async () => {
        mockImports();

        mockHandshake.mockReturnValue(
          Promise.resolve({
            challenge: {
              fields: mockFields,
              stateToken: mockStateToken,
            },
          }),
        );

        getVerifyPage = require('./').getVerifyPage;

        result = await getVerifyPage(req, res, next);
      });

      it('should log the outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:get', 'successful-page-load', req);
      });

      it('should set response data', () => {
        expect(res.data).toEqual({
          foo: 'bar',
          payload: {
            values: {
              digit11: '',
              digit12: '',
              digit13: '',
              digit14: '',
            },
            errors: {},
            fields: [
              {
                id: 'digit11',
                label: '11pages.verify.digits-ordinal',
                name: 'digit11',
                type: 'text',
              },
              {
                id: 'digit12',
                label: '12pages.verify.digits-ordinal',
                name: 'digit12',
                type: 'text',
              },
              {
                id: 'digit13',
                label: '13pages.verify.digits-ordinal',
                name: 'digit13',
                type: 'text',
              },
            ],
            schema,
            stateToken: mockStateToken,
            backlink: {},
          },
        });
      });
    });

    describe('error', () => {
      beforeEach(async () => {
        mockImports();

        mockHandshake.mockReturnValue(
          Promise.resolve({
            error: mockError,
          }),
        );

        getVerifyPage = require('./').getVerifyPage;

        result = await getVerifyPage(req, res, next);
      });

      it('should log the outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:get', 'error', req);
      });

      it('should call next', () => {
        expect(next).toHaveBeenCalledWith(mockError);
      });

      it('expect next to be returned', () => {
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('[POST]', () => {
    let postVerifyPage;

    let mockElevateToken;

    beforeEach(() => {
      mockElevateToken = jest.fn();
      mockControllerFactory = jest.fn(() => ({
        elevateToken: mockElevateToken,
      }));
      mockLogger = jest.fn();
      mockGetClaims = jest.fn(() => ({ accessToken: mockAccessToken }));
      req.getClaims = mockGetClaims;
      res = {
        data: {
          foo: 'bar',
        },
        redirect: mockRedirect,
        isMobile: false,
        status: jest.fn(),
      };

      mockImports();
    });

    describe.skip('invalid form', () => {
      beforeEach(async () => {
        mockElevateToken.mockReturnValue(
          Promise.resolve({
            authenticated: mockAuthenticated,
          }),
        );

        postVerifyPage = require('./').postVerifyPage;

        result = await postVerifyPage(req, res, next);
      });

      it('should call controllerFactory correctly', () => {
        expect(mockControllerFactory).toHaveBeenCalledWith('verify', mockRegion);
      });

      it('should log invalid form outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:post', 'invalid-form-posted', req);
      });

      it('should set response data correctly', () => {
        expect(res.data).toEqual({
          foo: 'bar',
          payload: {
            values: {
              digit11: '3',
              digit12: '3',
              digit13: '3',
              digit14: undefined,
            },
            errors: {},

            schema: {
              ...schema,
              required: mockRequiredFields,
            },
            stateToken: mockStateToken,
            backlink: {},
          },
        });
      });

      it('should set 400 status', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should call next', () => {
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe('authenticated', () => {
      beforeEach(async () => {
        mockImports();

        mockElevateToken.mockReturnValue(
          Promise.resolve({
            authenticated: mockAuthenticated,
          }),
        );

        postVerifyPage = require('./').postVerifyPage;

        result = await postVerifyPage(req, res, next);
      });

      it('should call controllerFactory correctly', () => {
        expect(mockControllerFactory).toHaveBeenCalledWith('verify', mockRegion);
      });

      it('should call elevateToken', () => {
        expect(mockElevateToken).toHaveBeenCalledWith({
          fields: [
            {
              id: 'digit11',
              value: '3',
            },
            {
              id: 'digit12',
              value: '3',
            },
            {
              id: 'digit13',
              value: '3',
            },
          ],
          stateToken: mockStateToken,
          lang: mockLang,
          context: req,
          tracer: mockTracer,
        });
      });

      it('should log the outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:post', 'successful-token-upgrade', req);
      });

      it('should call mockSetAuthCookies utility', () => {
        expect(mockSetAuthCookies).toHaveBeenCalledWith(req, res, mockAuthenticated);
      });

      it('should redirect to login', () => {
        expect(mockRedirect).toHaveBeenCalledWith(config[mockRegion].externalApps.login);
      });

      it('should return redirect', () => {
        expect(result).toEqual(mockResponse);
      });
    });

    describe('challenge', () => {
      describe('account not locked', () => {
        beforeEach(async () => {
          mockImports();

          mockElevateToken.mockReturnValue(
            Promise.resolve({
              challenge: {
                fields: mockFields,
                stateToken: mockStateToken,
              },
            }),
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith(
            'verify:post',
            'error-incorrect-digits-entered',
            req,
          );
        });

        it('should set response data', () => {
          expect(res.data).toEqual({
            foo: 'bar',
            payload: {
              banner: {
                type: 'error',
                title: 'pages.verify.banners.incorrect-digits.title',
                text: 'pages.verify.banners.incorrect-digits.text',
              },
              values: {
                digit11: '',
                digit12: '',
                digit13: '',
                digit14: '',
              },
              errors: {},
              fields: [
                {
                  id: 'digit11',
                  label: '11pages.verify.digits-ordinal',
                  name: 'digit11',
                  type: 'text',
                },
                {
                  id: 'digit12',
                  label: '12pages.verify.digits-ordinal',
                  name: 'digit12',
                  type: 'text',
                },
                {
                  id: 'digit13',
                  label: '13pages.verify.digits-ordinal',
                  name: 'digit13',
                  type: 'text',
                },
              ],
              schema: {
                ...schema,
                required: mockRequiredFields,
              },
              stateToken: mockStateToken,
              accountLocked: undefined,
              backlink: {},
            },
          });
        });

        it('should set 400 status', () => {
          expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should call next', () => {
          expect(next).toHaveBeenCalledWith();
        });
      });

      describe('account locked', () => {
        beforeEach(async () => {
          mockImports();

          mockElevateToken.mockReturnValue(
            Promise.resolve({
              challenge: {
                fields: mockFields,
                stateToken: mockStateToken,
              },
              accountLocked: true,
            }),
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('verify:post', 'error-max-attempts-reached', req);
        });

        it('should set response data', () => {
          expect(res.data).toEqual({
            foo: 'bar',
            payload: {
              banner: {
                type: 'error',
                title: 'pages.verify.banners.account-locked.title',
                text: undefined,
              },
              values: {
                digit11: '',
                digit12: '',
                digit13: '',
                digit14: '',
              },
              errors: {},
              fields: [],
              schema: {
                ...schema,
                required: [],
              },
              stateToken: undefined,
              accountLocked: true,
              backlink: {},
            },
          });
        });

        it('should set 400 status', () => {
          expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should call next', () => {
          expect(next).toHaveBeenCalledWith();
        });
      });
    });

    describe('error', () => {
      beforeEach(async () => {
        mockImports();

        mockElevateToken.mockReturnValue(
          Promise.resolve({
            error: mockError,
          }),
        );

        postVerifyPage = require('./').postVerifyPage;

        result = await postVerifyPage(req, res, next);
      });

      it('should log the outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:post', 'error', req);
      });

      it('should call next', () => {
        expect(next).toHaveBeenCalledWith(mockError);
      });

      it('expect next to be returned', () => {
        expect(result).toEqual(mockResponse);
      });
    });
  });
});
