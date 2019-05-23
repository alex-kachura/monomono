const original = jest.requireActual('config');

export const mockGet = jest.fn((key) => key);

const mockConfig = {
  ...original,
  get: mockGet,
};

export default mockConfig;
