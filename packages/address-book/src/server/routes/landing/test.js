import { getAddresses } from '../../controllers/address';
import { logOutcome } from '../../logger';
import { getLandingPage, getBreadcrumb } from '.';
import { getLocalePhrase } from '../../utils/i18n';
import { requestFactory, responseFactory, next, send } from '../../utils/test-helpers';

jest.mock('../../controllers/address');

const payloadFactory = (req, extra) => {
  return {
    payload: {
      addresses: {
        'other-addresses': [],
        'primary-addresses': {
          clubcard: {
            addressLines: [
              {
                label: 'Lever building',
                lineNumber: 1,
              },
            ],
            label: 'HOME',
            postTown: 'London',
            postcode: 'EC1R 5AR',
            tags: ['primaryLoyalty'],
            telephoneNumbers: [
              {
                label: 'Day',
                value: '07429049112',
              },
            ],
          },
          grocery: {
            addressLines: [
              {
                label: 'Lever building',
                lineNumber: 1,
              },
            ],
            label: 'HOME',
            postTown: 'London',
            postcode: 'EC1R 5AR',
            tags: ['primaryDelivery'],
            telephoneNumbers: [
              {
                label: 'Day',
                value: '07429049112',
              },
            ],
          },
        },
      },
      breadcrumb: getBreadcrumb(req, getLocalePhrase),
      banner: {
        bannerType: '',
        description: '',
        title: '',
      },
      ...extra,
    },
  };
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

getAddresses.mockResolvedValue(mockAddresses);

describe('[Route: /]', () => {
  describe('[GET]', () => {
    describe('[Content-Type: html]', () => {
      describe('success', () => {
        const req = requestFactory({
          query: {
            action: 'mockUpdated',
          },
        });

        const res = responseFactory();
        const payload = payloadFactory(req);

        beforeAll(async () => {
          await getLandingPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('landing', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(res.data).toEqual(payload);
        });

        it('should call next correctly', () => {
          expect(next).toHaveBeenCalledWith();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });
      });
    });

    describe('[Content-Type: json]', () => {
      describe('success', () => {
        const req = requestFactory({
          query: {
            action: 'mockUpdated',
          },
        });

        const res = responseFactory({ responseType: 'json' });
        const payload = payloadFactory(req);

        beforeAll(async () => {
          await getLandingPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('landing', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(send).toHaveBeenCalledWith(payload);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });
      });
    });
  });

  describe('disabled by segmentation', () => {
    const reqWithSegment = requestFactory({
      cookies: {
        // eslint-disable-next-line camelcase
        myaccount_segment_singleAddressBook: '{"segment":"disabled","weighting":"100"}',
      },
    });

    const res = responseFactory();

    beforeAll(async () => {
      await getLandingPage(reqWithSegment, res, next);
    });

    it('should redirect to Address Book in My Account', () => {
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('manage/address-book'));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });
});
