import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

describe('[Route: /]', () => {
  jest.addMatchers(matchers);

  describe('[GET]', () => {
    let getLandingPage;
    const mockTracer = 'mock-tracer';
    const mockSend = jest.fn();
    let responseType;
    const mockUpdated = 'mock-updated';
    const mockLocale = 'mock-locale';
    const req = {
      sessionId: mockTracer,
      locale: {
        type: mockLocale,
      },
      query: {
        updated: mockUpdated,
      },
      getLocalePhrase: (key) => key,
      region: 'mock-region',
      lang: 'mock-lang'
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

          getLandingPage = require('./').getLandingPage;

          await getLandingPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(mockLogger).toHaveBeenCalledWith('landing', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(res.data).toEqualImmutable(
            fromJS({
              payload: {
                breadcrumb: [
                  {
                    text: 'pages.landing.title',
                  },
                ],
                banner: {
                  bannerType: '',
                  title: '',
                  errorType: '',
                },
              },
            }),
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

          getLandingPage = require('./').getLandingPage;

          await getLandingPage(req, res, next);
        });

        it('should set the correct response data', () => {
          expect(mockSend).toHaveBeenCalledWith({
            payload: {
              breadcrumb: [
                {
                  text: 'pages.landing.title',
                },
              ],
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
