const original = jest.requireActual('@web-foundations/service-contact');

export const mockOn = jest.fn();
export const mockGetFullAddresses = jest.fn();
export const mockRemoveAddress = jest.fn();

const MockContactService = jest.fn(function ContactServiceMock() {
  Object.assign(this, {
    ...original.default,
    on: mockOn,
    getFullAddresses: mockGetFullAddresses,
    removeAddress: mockRemoveAddress,
  });
});

export const ContactServiceError = original.ContactServiceError;

export default MockContactService;
