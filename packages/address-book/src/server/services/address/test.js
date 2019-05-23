import AddressService from '@web-foundations/service-address';
import getAddressClient from '.';

describe('[Utility: Address service]', () => {
  describe('[Export: default]', () => {
    it('should be a factory function', () => {
      expect(typeof getAddressClient).toBe('function');
    });

    it('should return an instance of mock Address service', () => {
      expect(AddressService.mock).toBeTruthy();
      expect(getAddressClient('accessToken')).toBeInstanceOf(AddressService);
    });

    it('should set up request event handlers', () => {
      const address = getAddressClient('accessToken');

      expect(address.on).toHaveBeenCalledWith('requestStart', expect.any(Function));
      expect(address.on).toHaveBeenCalledWith('requestEnd', expect.any(Function));
    });
  });
});
