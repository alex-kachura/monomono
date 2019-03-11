import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';
import config from 'config';

describe('[Route: /edit]', () => {
  jest.addMatchers(matchers);

  describe('[GET]', () => {
    let getEditPage;
    const mockTracer = 'mock-tracer';
    const mockSend = jest.fn();
    let responseType;
    const mockUpdated = 'mock-updated';
    const mockLang = 'mock-lang';
    const mockRegion = 'GB';
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
    let mockGetPhraseFactory;
    let mockGetLocalePhrase;

    function mockGetImports() {
      jest.doMock('../../logger', () => ({ logOutcome: mockLogger }));
      jest.doMock('../../utils/i18n', () => ({
        getPhraseFactory: mockGetPhraseFactory,
      }));
    }

    beforeEach(() => {
      mockGetLocalePhrase = jest.fn((key) => key);
      mockGetPhraseFactory = jest.fn(() => mockGetLocalePhrase);
      mockLogger = jest.fn();
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

          getEditPage = require('./').getEditPage;

          await getEditPage(req, res, next);
        });

        it('should call getPhraseFactory with request lang', () => {
          expect(mockGetPhraseFactory).toHaveBeenCalledWith(mockLang);
        });

        it('should log correctly', () => {
          expect(mockLogger).toHaveBeenCalledWith('edit', 'successful', req);
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
                  fields: config[mockRegion].fields,
                  focusFieldId: 'sample1',
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

          getEditPage = require('./').getEditPage;

          await getEditPage(req, res, next);
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
                fields: config[mockRegion].fields,
                focusFieldId: 'sample1',
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
