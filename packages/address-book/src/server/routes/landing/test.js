import { getAddresses } from '../../controllers/address';
import { logOutcome } from '../../logger';
import { getLandingPage } from '.';
import { requestFactory, responseFactory, next, send } from '../../utils/test-helpers';

jest.mock('../../controllers/address');

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

        beforeAll(async () => {
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

        beforeAll(async () => {
          await getLandingPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('landing', 'successful', req);
        });

        it('should set the correct response data', () => {
          expect(send.mock.calls).toMatchSnapshot();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });
      });
    });
  });
});
