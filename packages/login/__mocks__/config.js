const original = jest.requireActual('config');

export const get = jest.fn((key) => key);

const mockConfig = {
  ...original,
  get,
};

export default mockConfig;
