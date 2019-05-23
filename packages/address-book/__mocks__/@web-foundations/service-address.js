const original = jest.requireActual('@web-foundations/service-address');

export const mockOn = jest.fn();

const MockAddressService = jest.fn(function AddressServiceMock() {
  Object.assign(this, {
    ...original.default,
    on: mockOn,
  });
});

export default MockAddressService;
