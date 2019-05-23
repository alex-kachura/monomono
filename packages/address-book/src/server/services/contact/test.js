import ContactService from '@web-foundations/service-contact';
import getContactClient from '.';

describe('[Utility: Contact service]', () => {
  describe('[Export: default]', () => {
    it('should be a factory function', () => {
      expect(typeof getContactClient).toBe('function');
    });

    it('should return an instance of mock Contact service', () => {
      expect(ContactService.mock).toBeTruthy();
      expect(getContactClient('accessToken')).toBeInstanceOf(ContactService);
    });

    it('should set up request event handlers', () => {
      const contact = getContactClient('accessToken');

      expect(contact.on).toHaveBeenCalledWith('requestStart', expect.any(Function));
      expect(contact.on).toHaveBeenCalledWith('requestEnd', expect.any(Function));
    });
  });
});
