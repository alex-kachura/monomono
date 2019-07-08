import { getFullAddresses, removeAddress } from '@web-foundations/service-contact';

const { getAddresses, deleteAddress } = jest.requireActual('.');

describe('[Controller: Address]', () => {
  describe('getAddresses', () => {
    it('should call Contact', async () => {
      await getAddresses('accessToken');

      expect(getFullAddresses).toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    it('should call Contact', async () => {
      await deleteAddress('accessToken', 'contactAddressId', {
        context: 'test-context',
        tracer: 'test-tracer',
      });

      expect(removeAddress).toHaveBeenCalledWith('contactAddressId', {
        context: 'test-context',
        tracer: 'test-tracer',
      });
    });
  });
});
