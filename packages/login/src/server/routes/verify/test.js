import config from 'config';

describe('[Route: /verify]', () => {
  let result;
  const mockTracer = 'mock-tracer';
  const mockSend = jest.fn();
  let responseType;
  const mockUpdated = 'mock-updated';
  const mockLang = 'mock-lang';
  const mockRegion = 'GB';
  const mockAccessToken = 'mock-token';
  const mockError = 'mock-error';
  const mockStateToken = 'mock-state-token';
  const mockBody = {
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
  const res = {
    format: (f) => f[responseType](),
    send: mockSend,
    data: {},
  };
  let next;
  let mockLogger;
  let mockControllerFactory;
  let mockGetClaims;
  const mockAuthenticated = 'mock-authenticated';
  const mockResponse = 'mock-response';
  const mockFields = 'mock-fields';
  let mockMapPayloadToFields;
  let mockMapValuesToPayload;
  let mockSendToLogin;

  function mockGetImports() {
    next = jest.fn(() => mockResponse);
    mockMapPayloadToFields = jest.fn((fields) => fields);
    mockMapValuesToPayload = jest.fn(() => mockFields);
    mockSendToLogin = jest.fn(() => mockResponse);

    jest.doMock('../../logger', () => ({ logOutcome: mockLogger }));
    jest.doMock('./utils', () => ({
      mapPayloadToFields: mockMapPayloadToFields,
      mapValuesToPayload: mockMapValuesToPayload,
      sendToLogin: mockSendToLogin,
    }));
    jest.doMock('../../controllers', () => mockControllerFactory);
  }

  afterEach(() => {
    next.mockClear();
    mockSend.mockClear();
    mockLogger.mockClear();
    jest.resetModules();
    res.data = {};
  });

  describe('[GET]', () => {
    let getVerifyPage;
    let mockHandshake;

    beforeEach(() => {
      mockHandshake = jest.fn();
      mockControllerFactory = jest.fn(() => ({
        handshake: mockHandshake,
      }));
      mockLogger = jest.fn();
      mockGetClaims = jest.fn(() => ({ accessToken: mockAccessToken }));
      req.getClaims = mockGetClaims;
    });

    describe('[Content-Type: html]', () => {
      beforeEach(() => {
        responseType = 'html';
      });

      describe('authenticated', () => {
        beforeEach(async () => {
          mockGetImports();

          mockHandshake.mockReturnValue(
            Promise.resolve({
              authenticated: mockAuthenticated,
            })
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
          expect(mockLogger).toHaveBeenCalledWith('get:verify', 'successful-user-already-16', req);
        });

        it('should call sendToLogin utility', () => {
          expect(mockSendToLogin).toHaveBeenCalledWith(
            req, res, mockAuthenticated
          );
        });

        it('should return result of sendToLogin', () => {
          expect(result).toEqual(mockResponse);
        });
      });

      describe('challenge', () => {
        beforeEach(async () => {
          mockGetImports();

          mockHandshake.mockReturnValue(
            Promise.resolve({
              challenge: {
                fields: mockFields,
                stateToken: mockStateToken,
              },
            })
          );

          getVerifyPage = require('./').getVerifyPage;

          result = await getVerifyPage(req, res, next);
        });

        it('should call mapPayloadToFields', () => {
          expect(mockMapPayloadToFields).toHaveBeenCalledWith(mockFields, mockLang);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('get:verify', 'successful-page-load', req);
        });

        it('should set response data', () => {
          expect(res.data).toEqual({
            payload: {
              breadcrumb: [],
              banner: {
                bannerType: '',
                title: '',
                errorType: '',
              },
              form: {
                fields: mockFields,
                focusFieldId: undefined,
                isFormValid: true,
                formSubmitted: false,
              },
              stateToken: mockStateToken,
            }
          });
        });
      });

      describe('error', () => {
        beforeEach(async () => {
          mockGetImports();

          mockHandshake.mockReturnValue(
            Promise.resolve({
              error: mockError,
            })
          );

          getVerifyPage = require('./').getVerifyPage;

          result = await getVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('get:verify', 'error', req);
        });

        it('should call next', () => {
          expect(next).toHaveBeenCalledWith(mockError);
        });

        it('expect next to be returned', () => {
          expect(result).toEqual(mockResponse);
        });
      });
    });

    describe('[Content-Type: json]', () => {
      describe('challenge', () => {
        beforeEach(async () => {
          responseType = 'json';

          mockGetImports();

          mockHandshake.mockReturnValue(
            Promise.resolve({
              challenge: {
                fields: mockFields,
                stateToken: mockStateToken,
              },
            })
          );

          getVerifyPage = require('./').getVerifyPage;

          result = await getVerifyPage(req, res, next);
        });

        it('should send the response', () => {
          expect(mockSend).toHaveBeenCalledWith({
            payload: {
              breadcrumb: [],
              banner: {
                bannerType: '',
                title: '',
                errorType: '',
              },
              form: {
                fields: mockFields,
                focusFieldId: undefined,
                isFormValid: true,
                formSubmitted: false,
              },
              stateToken: mockStateToken,
            }
          });
        });
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
    });

    describe('[Content-Type: html]', () => {
      beforeEach(() => {
        responseType = 'html';
      });

      describe('authenticated', () => {
        beforeEach(async () => {
          mockGetImports();

          mockElevateToken.mockReturnValue(
            Promise.resolve({
              authenticated: mockAuthenticated,
            })
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should call controllerFactory correctly', () => {
          expect(mockControllerFactory).toHaveBeenCalledWith('verify', mockRegion);
        });

        it('should call mapValuesToPayload', () => {
          expect(mockMapValuesToPayload).toHaveBeenCalledWith(mockBody);
        });

        it('should call elevateToken', () => {
          expect(mockElevateToken).toHaveBeenCalledWith({
            fields: mockFields,
            stateToken: mockStateToken,
            lang: mockLang,
            context: req,
            tracer: mockTracer,
          });
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('post:verify', 'successful-token-upgrade', req);
        });

        it('should call sendToLogin utility', () => {
          expect(mockSendToLogin).toHaveBeenCalledWith(
            req, res, mockAuthenticated
          );
        });

        it('should return result of sendToLogin', () => {
          expect(result).toEqual(mockResponse);
        });
      });

      describe('challenge', () => {
        describe('account not locked', () => {
          beforeEach(async () => {
            mockGetImports();

            mockElevateToken.mockReturnValue(
              Promise.resolve({
                challenge: {
                  fields: mockFields,
                  stateToken: mockStateToken,
                },
              })
            );

            postVerifyPage = require('./').postVerifyPage;

            result = await postVerifyPage(req, res, next);
          });

          it('should log the outcome', () => {
            expect(mockLogger).toHaveBeenCalledWith('post:verify', 'error-incorrect-digits-entered', req);
          });

          it('should call mapPayloadToFields', () => {
            expect(mockMapPayloadToFields).toHaveBeenCalledWith(mockFields, mockLang);
          });

          it('should set response data', () => {
            expect(res.data).toEqual({
              payload: {
                breadcrumb: [],
                banner: {
                  bannerType: 'error',
                  title: 'Wrong, please try again',
                  errorType: '',
                },
                form: {
                  fields: mockFields,
                  focusFieldId: undefined,
                  isFormValid: true,
                  formSubmitted: false,
                },
                stateToken: mockStateToken,
              }
            });
          });
        });

        describe('account locked', () => {
          beforeEach(async () => {
            mockGetImports();

            mockElevateToken.mockReturnValue(
              Promise.resolve({
                challenge: {
                  fields: mockFields,
                  stateToken: mockStateToken,
                },
                accountLocked: true,
              })
            );

            postVerifyPage = require('./').postVerifyPage;

            result = await postVerifyPage(req, res, next);
          });

          it('should log the outcome', () => {
            expect(mockLogger).toHaveBeenCalledWith('post:verify', 'error-max-attempts-reached', req);
          });

          it('should not call mapPayloadToFields', () => {
            expect(mockMapPayloadToFields).not.toHaveBeenCalled();
          });

          it('should set response data', () => {
            expect(res.data).toEqual({
              payload: {
                breadcrumb: [],
                banner: {
                  bannerType: 'error',
                  title: 'Too many failures, locked out',
                  errorType: '',
                },
                form: {
                  fields: [],
                  focusFieldId: undefined,
                  isFormValid: true,
                  formSubmitted: false,
                },
                stateToken: undefined,
                accountLocked: true,
              }
            });
          });
        });
      });

      describe('error', () => {
        beforeEach(async () => {
          mockGetImports();

          mockElevateToken.mockReturnValue(
            Promise.resolve({
              error: mockError,
            })
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('post:verify', 'error', req);
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
});
