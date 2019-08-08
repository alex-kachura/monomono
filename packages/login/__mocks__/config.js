const original = jest.requireActual('config');

export const get = jest.fn((key) => key);

const mockConfig = {
  ...original,
  GB: {
    ...original.GB,
    externalApps: {
      ...original.GB.externalApps,
      tescoHomepage: 'https://www-local.tesco.com',
    },
    backToWhitelist: [
      {
        url: 'https://www-local.tesco.com/account/address-book/en-GB',
        label: 'back-to.address-book',
      },
    ],
  },
  get,
};

export default mockConfig;
