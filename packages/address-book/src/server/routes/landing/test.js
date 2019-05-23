import { mockGetFullAddresses } from '@web-foundations/service-contact';
import { logOutcome } from '../../logger';
import { getLandingPage } from '.';

describe('[Route: /]', () => {
  let responseType;
  const mockTracer = 'mock-tracer';
  const mockUpdated = 'mock-updated';
  const mockLocale = 'mock-locale';
  const mockAccessToken = 'mock-token';
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
  const req = {
    sessionId: mockTracer,
    locale: { type: mockLocale },
    query: { updated: mockUpdated },
    region: 'mock-region',
    lang: 'mock-lang',
    getClaims: jest.fn(() => ({ accessToken: mockAccessToken })),
  };
  const res = {
    format: (formats) => formats[responseType](),
    send: jest.fn(),
    data: {},
  };
  const next = jest.fn();

  beforeAll(() => {
    expect(mockGetFullAddresses.mock).toBeTruthy();
    expect(logOutcome.mock).toBeTruthy();
  });

  describe('[GET]', () => {
    describe('[Content-Type: html]', () => {
      beforeAll(() => {
        responseType = 'html';
      });

      beforeEach(() => {
        res.data = {};
      });

      describe('success', () => {
        beforeEach(async () => {
          mockGetFullAddresses.mockResolvedValueOnce(mockAddresses);

          await getLandingPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('landing', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(res.data).toMatchSnapshot();
        });

        it('should call next correctly', () => {
          expect(next).toHaveBeenCalledWith();
        });
      });
    });

    describe('[Content-Type: json]', () => {
      beforeAll(() => {
        responseType = 'json';
      });

      beforeEach(() => {
        res.data = {};
      });

      describe('success', () => {
        beforeEach(async () => {
          mockGetFullAddresses.mockResolvedValueOnce(mockAddresses);

          await getLandingPage(req, res, next);
        });

        it('should set the correct response data', () => {
          expect(res.send.mock.calls).toMatchSnapshot();
        });
      });
    });
  });
});
