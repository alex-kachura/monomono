describe.skip('[Route: /]', () => {
  describe('[GET]', () => {
    let getLandingPage;
    const mockTracer = 'mock-tracer';
    const mockSend = jest.fn();
    let responseType;
    const mockUpdated = 'mock-updated';
    const mockLocale = 'mock-locale';
    const mockAccessToken = 'mock-token';
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
      lang: 'mock-lang',
    };
    const res = {
      format: (f) => f[responseType](),
      send: mockSend,
      data: {},
    };
    const mockAddresses = [
      {
        label: 'HOME',
        tags: ['primaryDelivery'],
        addressLines: [
          {
            lineNumber: 1,
            label: 'Lever building',
          },
        ],
        postcode: 'EC1R 5AR',
        postTown: 'London',
        telephoneNumbers: [
          {
            label: 'Day',
            value: '07429049112',
          },
        ],
      },
      {
        label: 'HOME',
        tags: ['primaryLoyalty'],
        addressLines: [
          {
            lineNumber: 1,
            label: 'Lever building',
          },
        ],
        postcode: 'EC1R 5AR',
        postTown: 'London',
        telephoneNumbers: [
          {
            label: 'Day',
            value: '07429049112',
          },
        ],
      },
    ];
    const next = jest.fn();
    let mockLogger;
    let mockGetPhraseFactory;
    let mockGetLocalePhrase;
    let mockGetAddresses;
    let mockGetClaims;
    let mockMakeOnRequestEventHandler;
    let mockResponse;

    function mockGetImports() {
      jest.doMock('../../logger', () => ({
        logOutcome: mockLogger,
        makeOnRequestEventHandler: mockMakeOnRequestEventHandler,
      }));
      jest.doMock('../../utils/i18n', () => ({
        getPhraseFactory: mockGetPhraseFactory,
      }));
      jest.doMock('../../controllers/address', () => ({
        getAddresses: mockGetAddresses,
      }));
    }

    beforeEach(() => {
      mockGetLocalePhrase = jest.fn((key) => key);
      mockGetPhraseFactory = jest.fn(() => mockGetLocalePhrase);
      mockLogger = jest.fn();
      mockGetClaims = jest.fn(() => ({ accessToken: mockAccessToken }));
      mockGetAddresses = jest.fn(() => mockAddresses);
      mockMakeOnRequestEventHandler = jest.fn(() => () => {}); // eslint-disable-line
      mockResponse = {
        addresses: {
          'primary-addresses': {
            clubcard: {
              label: 'HOME',
              tags: ['primaryLoyalty'],
              addressLines: [
                {
                  lineNumber: 1,
                  label: 'Lever building',
                },
              ],
              postcode: 'EC1R 5AR',
              postTown: 'London',
              telephoneNumbers: [
                {
                  label: 'Day',
                  value: '07429049112',
                },
              ],
            },
            grocery: {
              label: 'HOME',
              tags: ['primaryDelivery'],
              addressLines: [
                {
                  lineNumber: 1,
                  label: 'Lever building',
                },
              ],
              postcode: 'EC1R 5AR',
              postTown: 'London',
              telephoneNumbers: [
                {
                  label: 'Day',
                  value: '07429049112',
                },
              ],
            },
          },
          'other-addresses': [],
        },
        breadcrumb: [
          {
            text: 'pages.landing.title',
          },
        ],
        banner: {
          bannerType: '',
          title: '',
          description: '',
        },
      };
    });

    afterEach(() => {
      next.mockClear();
      mockSend.mockClear();
      mockLogger.mockClear();
      jest.resetModules();
      res.data = {};
    });

    describe('[Content-Type: html]', () => {
      beforeEach(() => {
        responseType = 'html';
        req.getClaims = mockGetClaims;
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
          expect(res.data).toEqual({ payload: mockResponse });
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
          expect(mockSend).toHaveBeenCalledWith({ payload: mockResponse });
        });
      });
    });
  });
});
