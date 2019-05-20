import Immutable from 'immutable';
import { Promise } from 'q';

describe('[Route: /]', () => {
  const accessToken = 'mock-access-token';
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

  describe('[POST]', () => {
    describe('Successful deletion', () => {
      let mockRes;
      let mockReq;
      let mockNext;
      let mockController;
      let deleteAddressRoute;
      let mockGetPhraseFactory;
      let mockGetLocalePhrase;

      beforeAll(async () => {
        mockReq = {
          body: { 'contact-address-id': 'mock-address-id' },
          sessionId: 'mock-tracer',
          referer: 'mock-referer',
          getClaims: () => ({ accessToken: 'mock-access-token' }),
        };
        mockRes = {
          addresses: [],
          format: (obj) => obj.html(),
          status: jest.fn(),
          data: Immutable.fromJS({}),
        };
        mockNext = jest.fn();
        mockController = {
          deleteAddress: jest.fn().mockReturnValue(Promise.resolve()),
          getAddresses: jest.fn().mockReturnValue(Promise.resolve(mockAddresses)),
        };
        mockGetLocalePhrase = jest.fn((key) => key);
        mockGetPhraseFactory = jest.fn(() => mockGetLocalePhrase);
        jest.doMock('../../controllers/address', () => mockController);
        jest.doMock('../../utils/i18n', () => ({
          getPhraseFactory: mockGetPhraseFactory,
        }));
        deleteAddressRoute = require('./').postDeleteAddressRoute; // eslint-disable-line global-require

        await deleteAddressRoute(mockReq, mockRes, mockNext);
      });

      afterAll(() => {
        jest.resetModules();
      });

      it('"next" should be called', () => {
        expect(mockNext).toHaveBeenCalled();
      });

      it('"deleteAddress" should be called', () => {
        expect(mockController.deleteAddress).toHaveBeenCalled();
      });

      it('"getAddresses" should be called', () => {
        expect(mockController.getAddresses).toHaveBeenCalledWith(accessToken, {
          context: mockReq,
        });
      });

      it('"mockRes" status code to be 202 - accepted', () => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
      });
    });

    describe('Service failure', () => {
      let mockRes;
      let mockReq;
      let mockNext;
      let mockController;
      let deleteAddressRoute;
      const err = new Error();

      beforeAll(async () => {
        mockReq = {
          body: { 'contact-address-id': 'mock-address-id' },
          sessionId: 'mock-tracer',
          referer: 'mock-referer',
          getClaims: () => ({ accessToken: 'mock-access-token' }),
          data: Immutable.fromJS({}),
        };
        mockRes = {
          tests: {
            addressBook: {
              segment: 'enabled',
            },
          },
          format: (obj) => obj.html(),
          status: jest.fn(),
          data: Immutable.fromJS({}),
        };
        mockNext = jest.fn();
        mockController = {
          deleteAddress: jest.fn(() => Promise.reject(err)),
          getAddresses: jest.fn().mockReturnValue(Promise.resolve(mockAddresses)),
        };
        jest.doMock('../../controllers/address', () => mockController);
        deleteAddressRoute = require('./').postDeleteAddressRoute; // eslint-disable-line global-require

        await deleteAddressRoute(mockReq, mockRes, mockNext);
      });

      it('"next" should be called with error', () => {
        expect(mockNext).toHaveBeenCalledWith(err);
      });

      it('"deleteAddress" should be called', () => {
        expect(mockController.deleteAddress).toHaveBeenCalled();
      });

      it('"getAddresses" should not be called', () => {
        expect(mockController.getAddresses).not.toHaveBeenCalled();
      });
    });
  });
});
