import { deleteAddress, getAddresses } from '../../controllers/address';
import { postDeleteAddressRoute } from './';
import { logOutcome } from '../../logger';
import { requestFactory, responseFactory, next } from '../../utils/test-helpers';

jest.mock('../../controllers/address');

const mockAddresses = [
  {
    addressIndex: 'GHS_13371337',
    isPrimary: true,
    label: 'test 1',
    addressUuid: 'trn:tesco:address:address:uuid:0a2590b0-acad-414e-bd25-ff47c58358a5',
    legacyAddress: null,
    tags: ['primaryDelivery', 'delivery', 'GHS'],
    isCompleteAddress: true,
  },
];

getAddresses.mockResolvedValue(mockAddresses);

describe('[Route: /]', () => {
  describe('[POST]', () => {
    describe('Successful deletion', () => {
      const req = requestFactory({
        body: {
          'contact-address-id': 'mock-id',
        },
      });
      const res = responseFactory();

      beforeAll(async () => {
        await postDeleteAddressRoute(req, res, next);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('"next" should be called', () => {
        expect(next).toHaveBeenCalled();
      });

      it('should log correctly', () => {
        expect(logOutcome).toHaveBeenCalledWith('delete-address', 'successful', req);
      });

      it('"res" status code to be 200 - successful', () => {
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe('Service failure', () => {
      const req = requestFactory({
        body: {
          'contact-address-id': 'mock-id',
        },
      });
      const res = responseFactory();
      const err = new Error();

      beforeAll(async () => {
        deleteAddress.mockRejectedValueOnce(err);
        await postDeleteAddressRoute(req, res, next);
      });

      it('should log correctly', () => {
        expect(logOutcome).toHaveBeenCalledWith('delete-address', 'error', req);
      });

      it('"next" should be called with error', () => {
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });
});
