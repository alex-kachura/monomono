import { mockGetFullAddresses, mockRemoveAddress } from '@web-foundations/service-contact';
import { getAddresses, deleteAddress } from '.';

describe('[Controller: Address]', () => {
  describe('getAddresses', () => {
    it('should call Contact', async () => {
      await getAddresses('accessToken');

      expect(mockGetFullAddresses).toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    it('should call Contact', async () => {
      await deleteAddress('accessToken', 'contactAddressId', {
        context: 'test-context',
        tracer: 'test-tracer',
      });

      expect(mockRemoveAddress).toHaveBeenCalledWith('contactAddressId', {
        context: 'test-context',
        tracer: 'test-tracer',
      });
    });
  });
});
