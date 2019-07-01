import { addresses, AddressServiceError } from '@web-foundations/service-address';
import { lookup } from './';
import { next, json, requestFactory, responseFactory } from '../../utils/test-helpers';

jest.mock('../../controllers/delivery-address/_default');

describe('[Route: /lookup]', () => {
  describe('[GET]', () => {
    describe('[success]', () => {
      const res = responseFactory();

      const req = requestFactory({
        query: {
          postcode: 'EC1R 5AR',
        },
      });

      beforeAll(async () => {
        await lookup(req, res, next);
      });

      it('should call addresses correctly', () => {
        expect(addresses).toHaveBeenCalledWith({
          tracer: req.sessionId,
          context: req,
          postcode: 'EC1R5AR',
        });
      });

      it('should call json ', () => {
        expect(json).toHaveBeenCalled();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });

    describe.each([
      new AddressServiceError(AddressServiceError.Codes.POSTCODE_NOT_FOUND),
      new Error('Kaboom!!!'),
    ])('[failure] - %s', (error) => {
      const res = responseFactory();

      const req = requestFactory({
        query: {
          postcode: 'INVALID',
        },
      });

      beforeAll(async () => {
        addresses.mockRejectedValueOnce(error);

        await lookup(req, res, next);
      });

      it('should call addresses correctly', () => {
        expect(addresses).toHaveBeenCalledWith({
          tracer: req.sessionId,
          context: req,
          postcode: 'INVALID',
        });
      });
      if (error instanceof AddressServiceError) {
        it('should call next', () => {
          expect(next).toHaveBeenCalledWith();
        });
      }

      if (!(error instanceof AddressServiceError))
        it('should call next with error', () => {
          expect(next).toHaveBeenCalledWith(error);
        });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });
  });
});
