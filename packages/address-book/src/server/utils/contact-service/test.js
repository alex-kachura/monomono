describe('[Utility: Contact service]', () => {
  let MockedContact;
  let contactFactory;

  beforeEach(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    MockedContact = class {
      on = jest.fn(); // eslint-disable-line
    };

    jest.doMock('@web-foundations/service-contact', () => MockedContact);

    contactFactory = require('./').default;
  });

  describe('[Export: default]', () => {
    it('should be a factory function', () => {
      expect(typeof contactFactory).toBe('function');
    });

    it('should return a Contact service client instance', () => {
      expect(contactFactory('accessToken')).toBeInstanceOf(MockedContact);
    });

    it('should set up request event handlers', () => {
      const contact = contactFactory('accessToken');

      expect(contact.on).toHaveBeenCalledWith('requestStart', expect.any(Function));
      expect(contact.on).toHaveBeenCalledWith('requestEnd', expect.any(Function));
    });
  });
});
