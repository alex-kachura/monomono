import {
  addAddress,
  getSingleAddress,
  updatePhoneNumber,
  updateAddress as mockUpdateAddress,
} from '@web-foundations/service-contact';
import { getAddress as mockGetAddress } from '@web-foundations/service-address';
import { ErrorCodes } from '../../../utils/error-handlers';
import { getAddress, updateAddress, createAddress } from './';

const addressId = 'mock-address-id';
const addressUuid = 'mock-uuid';
const newAddressUuid = 'new-mock-uuid';
const tracer = 'mock-tracer-id';
const context = 'mock-context';
const accessToken = 'mock-token';

const telephoneNumbers = [
  {
    telephoneNumberIndex: 'telephone_number_index_day',
    label: 'Day',
    value: '07429049112',
  },
  {
    telephoneNumberIndex: 'telephone_number_index_evening',
    label: 'Evening',
    value: '07429049112',
  },
  {
    telephoneNumberIndex: 'telephone_number_index_mobile',
    label: 'Mobile',
    value: '07429049112',
  },
];

const contactAddress = {
  telephoneNumbers,
  addresses: [
    {
      label: 'home',
      addressUuid,
      tags: ['delivery'],
    },
  ],
};

const address = {
  id: addressUuid,
  postTown: 'mock-town',
  postcode: 'EC1R 5AR',
  addressLines: [
    {
      lineNumber: 1,
      value: 'line-1',
    },
  ],
};

const nonDeliveryAddress = {
  ...contactAddress,
  addresses: [
    {
      addressUuid,
      tags: [],
    },
  ],
};

const defaultData = {
  'address-id': addressUuid,
  'address-line1': 'line-1',
  'address-line2': '',
  'address-line3': '',
  day: '07429049112',
  evening: '07429049112',
  mobile: '07429049112',
  postcode: 'EC1R 5AR',
  town: 'mock-town',
  'address-label': 'home',
};

getSingleAddress.mockResolvedValue(contactAddress);
mockGetAddress.mockResolvedValue(address);

describe('[Controller - Delivery-Address]', () => {
  describe('[getAddress]', () => {
    describe('[Success]', () => {
      let result;

      beforeAll(async () => {
        result = await getAddress({ addressId: addressUuid, accessToken, tracer, context });
      });

      it('should call `getSingleAddress` correctly', async () => {
        expect(getSingleAddress).toHaveBeenCalledWith(addressUuid, { tracer, context });
      });

      it('should call `getAddress` correctly', async () => {
        expect(mockGetAddress).toHaveBeenCalledWith({ addressId: addressUuid, context, tracer });
      });

      it('should return address', async () => {
        expect(result).toEqual(defaultData);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });

    describe('[Error - NOT_DELIVERY_ADDRESS]', () => {
      let error;

      beforeAll(async () => {
        getSingleAddress.mockResolvedValueOnce(nonDeliveryAddress);
        try {
          await getAddress({ addressId, accessToken, tracer, context });
        } catch (e) {
          error = e;
        }
      });

      it('should call `getSingleAddress` correctly', async () => {
        expect(getSingleAddress).toHaveBeenCalledWith(addressId, { tracer, context });
      });

      it('should not call `getAddress`', async () => {
        expect(mockGetAddress).not.toHaveBeenCalled();
      });

      it('should throw `NOT_DELIVERY_ADDRESS`', async () => {
        expect(error).toEqual(new Error(ErrorCodes.NOT_DELIVERY_ADDRESS));
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });
  });

  describe('[addAddress]', () => {
    describe('[Success]', () => {
      beforeAll(async () => {
        await createAddress({ accessToken, data: defaultData, context, tracer });
      });

      it('should call `addAddress`', () => {
        expect(addAddress).toHaveBeenCalledWith(
          addressUuid,
          'home',
          [
            { numberType: 'day', value: '07429049112' },
            { numberType: 'evening', value: '07429049112' },
            { numberType: 'mobile', value: '07429049112' },
          ],
          {
            tracer,
            context,
          },
        );
      });
    });
  });

  describe('[updateAddress]', () => {
    describe('[Success]', () => {
      beforeAll(async () => {
        await updateAddress({
          data: {
            ...defaultData,
            'address-id': newAddressUuid,
            mobile: '07429049113',
          },
          addressIndex: addressId,
          accessToken,
          tracer,
          context,
        });
      });

      it('should call `getSingleAddress` correctly', () => {
        expect(getSingleAddress).toHaveBeenCalledWith(addressId, { tracer, context });
      });

      it('should call `updatePhoneNumber` correctly', () => {
        expect(updatePhoneNumber).toHaveBeenCalledWith(
          'telephone_number_index_mobile',
          { value: '07429049113' },
          { tracer, context },
        );
      });

      it('should call `updateAddress` correctly', () => {
        expect(mockUpdateAddress).toHaveBeenCalledWith(
          addressId,
          {
            addressUuid: newAddressUuid,
            label: 'home',
          },
          {
            tracer,
            context,
          },
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });

    describe('[Error - NOT_DELIVERY_ADDRESS]', () => {
      let error;

      beforeAll(async () => {
        getSingleAddress.mockResolvedValueOnce(nonDeliveryAddress);

        try {
          await getAddress({ addressId, accessToken, tracer, context });
        } catch (e) {
          error = e;
        }
      });

      it('should call `getSingleAddress` correctly', async () => {
        expect(getSingleAddress).toHaveBeenCalledWith(addressId, { tracer, context });
      });

      it('should not call `getAddress`', async () => {
        expect(mockGetAddress).not.toHaveBeenCalled();
      });

      it('should throw `NOT_DELIVERY_ADDRESS`', async () => {
        expect(error).toEqual(new Error(ErrorCodes.NOT_DELIVERY_ADDRESS));
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });
  });
});
