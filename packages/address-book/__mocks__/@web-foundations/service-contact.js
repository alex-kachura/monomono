const original = jest.requireActual('@web-foundations/service-contact');

export const on = jest.fn();
export const addAddress = jest.fn().mockResolvedValue({});
export const getSingleAddress = jest.fn().mockResolvedValue({});
export const getFullAddresses = jest.fn().mockResolvedValue([]);
export const removeAddress = jest.fn().mockResolvedValue();
export const updatePhoneNumber = jest.fn().mockResolvedValue();
export const updateAddress = jest.fn().mockResolvedValue();
export const validatePhoneNumber = jest.fn().mockResolvedValue({ isValid: true });
const MockContactService = jest.fn(function ContactServiceMock() {
  Object.assign(this, {
    ...original.default,
    on,
    getSingleAddress,
    getFullAddresses,
    removeAddress,
    updatePhoneNumber,
    updateAddress,
    validatePhoneNumber,
    addAddress,
  });
});

export const ContactServiceError = original.ContactServiceError;

export default MockContactService;
