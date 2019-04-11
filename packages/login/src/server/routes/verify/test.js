import config from 'config';

describe('[Route: /verify]', () => {
  let result;
  const mockFormikErrors = 'mock-formik-errors';
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
  const mockFields = 'mock-fields';
  const mockFieldsToRender = [
    {
      name: 'digit11',
    },
    {
      name: 'digit12',
    },
  ];
  const mockRequiredFields = ['digit11', 'digit12'];
  let mockMapPayloadToFields;
  let mockMapValuesToPayload;
  let mockSetAuthCookies;
  let mockConvertAJVErrorsToFormik;
  const mockValidator = jest.fn();
  let mockCompile;
  let mockAjv;

  function mockImports() {
    next = jest.fn(() => mockResponse);
    mockMapPayloadToFields = jest.fn(() => mockFieldsToRender);
    mockMapValuesToPayload = jest.fn(() => mockFields);
    mockSetAuthCookies = jest.fn(() => mockResponse);
    mockCompile = jest.fn(() => mockValidator);
    mockAjv = {
      compile: mockCompile,
    };
    mockConvertAJVErrorsToFormik = jest.fn(() => mockFormikErrors);

    jest.doMock('../../logger', () => ({ logOutcome: mockLogger }));
    jest.doMock('./utils', () => ({
      mapPayloadToFields: mockMapPayloadToFields,
      mapValuesToPayload: mockMapValuesToPayload,
      setAuthCookies: mockSetAuthCookies,
      ajv: mockAjv,
    }));
    jest.doMock('../../controllers', () => mockControllerFactory);
    jest.doMock('@oneaccount/react-foundations', () => ({
      convertAJVErrorsToFormik: mockConvertAJVErrorsToFormik,
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
      mockHandshake = jest.fn();
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
      };
    });

    describe('authenticated', () => {
      beforeEach(async () => {
        mockImports();

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
          })
        );

        getVerifyPage = require('./').getVerifyPage;

        result = await getVerifyPage(req, res, next);
      });

      it('should call mapPayloadToFields', () => {
        expect(mockMapPayloadToFields).toHaveBeenCalledWith(mockFields, mockLang);
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
            fields: mockFieldsToRender,
            schema: {
              ...schema,
              required: mockRequiredFields,
            },
            stateToken: mockStateToken,
          }
        });
      });
    });

    describe('error', () => {
      beforeEach(async () => {
        mockImports();

        mockHandshake.mockReturnValue(
          Promise.resolve({
            error: mockError,
          })
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

      mockImports();
    });

    describe('invalid form', () => {
      beforeEach(async () => {
        mockValidator.mockReturnValue(false);
        mockValidator.errors = mockFormikErrors;
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

      it('should compile validation schema', () => {
        expect(mockCompile).toHaveBeenCalledWith(schema);
      });

      it('should validate form', () => {
        expect(mockValidator).toHaveBeenCalledWith({ digit11: '3' });
      });

      it('should log invalid form outcome', () => {
        expect(mockLogger).toHaveBeenCalledWith('verify:post', 'invalid-form-posted', req);
      });

      it('should convert ajv errors to formik errors', () => {
        expect(mockConvertAJVErrorsToFormik).toHaveBeenCalledWith(mockFormikErrors, schema);
      });

      it('should call mapPayloadToFields correctly', () => {
        expect(mockMapPayloadToFields).toHaveBeenCalledWith([
          {
            id: 'digit11',
            value: '3',
          }
        ], mockLang)
      });

      it('should set response data correctly', () => {
        expect(res.data).toEqual({
          foo: 'bar',
          payload: {
            values: {
              digit11: '3',
              digit12: undefined,
              digit13: undefined,
              digit14: undefined,
            },
            errors: mockFormikErrors,
            fields: mockFieldsToRender,
            schema: {
              ...schema,
              required: mockRequiredFields,
            },
            stateToken: mockStateToken,
          }
        })
      });

      it('should call next', () => {
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe('authenticated', () => {
      beforeEach(async () => {
        mockValidator.mockReturnValue(true);
        mockValidator.errors = mockFormikErrors;

        mockImports();

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
            })
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('verify:post', 'error-incorrect-digits-entered', req);
        });

        it('should call mapPayloadToFields', () => {
          expect(mockMapPayloadToFields).toHaveBeenCalledWith(mockFields, mockLang);
        });

        it('should set response data', () => {
          expect(res.data).toEqual({
            foo: 'bar',
            payload: {
              banner: {
                bannerType: 'error',
                title: 'Wrong, please try again',
                errorType: '',
              },
              values: {
                digit11: '',
                digit12: '',
                digit13: '',
                digit14: '',
              },
              errors: {},
              fields: mockFieldsToRender,
              schema: {
                ...schema,
                required: mockRequiredFields,
              },
              stateToken: mockStateToken,
              accountLocked: undefined,
            }
          });
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
            })
          );

          postVerifyPage = require('./').postVerifyPage;

          result = await postVerifyPage(req, res, next);
        });

        it('should log the outcome', () => {
          expect(mockLogger).toHaveBeenCalledWith('verify:post', 'error-max-attempts-reached', req);
        });

        it('should not call mapPayloadToFields', () => {
          expect(mockMapPayloadToFields).not.toHaveBeenCalled();
        });

        it('should set response data', () => {
          expect(res.data).toEqual({
            foo: 'bar',
            payload: {
              banner: {
                bannerType: 'error',
                title: 'Too many failures, locked out',
                errorType: '',
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
            }
          });
        });
      });
    });

    describe('error', () => {
      beforeEach(async () => {
        mockImports();

        mockElevateToken.mockReturnValue(
          Promise.resolve({
            error: mockError,
          })
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
