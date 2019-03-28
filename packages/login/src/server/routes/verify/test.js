import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';
import config from 'config';

describe('[Route: /verify]', () => {
  jest.addMatchers(matchers);

  describe('[GET]', () => {
    let getVerifyPage;
    const mockTracer = 'mock-tracer';
    const mockSend = jest.fn();
    let responseType;
    const mockUpdated = 'mock-updated';
    const mockLang = 'mock-lang';
    const mockRegion = 'GB';
    const mockAccessToken = 'mock-token';
    const req = {
      sessionId: mockTracer,
      query: {
        updated: mockUpdated,
      },
      getLocalePhrase: (key) => key,
      lang: mockLang,
      region: mockRegion,
    };
    const res = {
      format: (f) => f[responseType](),
      send: mockSend,
      data: fromJS({}),
    };
    const next = jest.fn();
    let mockLogger;
    let mockControllerFactory;
    let mockGetPhraseFactory;
    let mockHandshake;
    let mockGetLocalePhrase;
    let mockGetClaims;

    function mockGetImports() {
      jest.doMock('../../logger', () => ({ logOutcome: mockLogger }));
      jest.doMock('../../utils/i18n', () => ({
        getPhraseFactory: mockGetPhraseFactory,
      }));
      jest.doMock('../../controllers', () => mockControllerFactory);
    }

    beforeEach(() => {
      mockHandshake = jest.fn();
      mockControllerFactory = jest.fn(() => ({
        handshake: mockHandshake,
      }));
      mockGetLocalePhrase = jest.fn((key) => key);
      mockGetPhraseFactory = jest.fn(() => mockGetLocalePhrase);
      mockLogger = jest.fn();
      mockGetClaims = jest.fn(() => ({ accessToken: mockAccessToken }));
      req.getClaims = mockGetClaims;
    });

    afterEach(() => {
      next.mockClear();
      mockSend.mockClear();
      mockLogger.mockClear();
      jest.resetModules();
      res.data = fromJS({});
    });

    describe('[Content-Type: html]', () => {
      beforeEach(() => {
        responseType = 'html';
      });

      describe('success', () => {
        beforeEach(async () => {
          mockGetImports();

          getVerifyPage = require('./').getVerifyPage;

          await getVerifyPage(req, res, next);
        });

        it('should call getPhraseFactory with request lang', () => {
          expect(mockGetPhraseFactory).toHaveBeenCalledWith(mockLang);
        });

        it('should call controllerFactory correctly', () => {
          expect(mockControllerFactory).toHaveBeenCalledWith('verify', mockRegion);
        });

        it('should call getClaims', () => {
          expect(mockGetClaims).toHaveBeenCalledWith();
        });

        it('should call handshake', () => {
          expect(mockHandshake).toHaveBeenCalledWith({
            tracer: mockTracer,
            accessToken: mockAccessToken,
            context: req,
          });
        });

        it('should log correctly', () => {
          expect(mockLogger).toHaveBeenCalledWith('verify', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(res.data).toEqualImmutable(
            fromJS({
              payload: {
                breadcrumb: [
                  {
                    text: 'pages.landing.title',
                    href: `/${config.basePath}/${config.appPath}/${mockLang}`,
                    useAltLink: true,
                  },
                  {
                    text: 'pages.edit.title',
                  },
                ],
                form: {
                  fields: [],
                  focusFieldId: undefined,
                  isFormValid: true,
                  formSubmitted: false,
                },
                banner: {
                  bannerType: '',
                  title: '',
                  errorType: '',
                },
              },
            })
          );
        });

        it('should call next correctly', () => {
          expect(next).toHaveBeenCalledWith();
        });
      });
    });

    describe('[Content-Type: json]', () => {
      beforeEach(() => {
        responseType = 'json';
      });

      describe('success', () => {
        beforeEach(async () => {
          mockGetImports();

          getVerifyPage = require('./').getVerifyPage;

          await getVerifyPage(req, res, next);
        });

        it('should set the correct response data', () => {
          expect(mockSend).toHaveBeenCalledWith({
            payload: {
              breadcrumb: [
                {
                  text: 'pages.landing.title',
                  href: `/${config.basePath}/${config.appPath}/${mockLang}`,
                  useAltLink: true,
                },
                {
                  text: 'pages.edit.title',
                },
              ],
              form: {
                fields: [],
                focusFieldId: undefined,
                isFormValid: true,
                formSubmitted: false,
              },
              banner: {
                bannerType: '',
                title: '',
                errorType: '',
              },
            },
          });
        });
      });
    });
  });
});
