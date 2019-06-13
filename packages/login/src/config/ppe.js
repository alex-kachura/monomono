module.exports = {
  // Import regional specific ppe environment config
  GB: require('./regional/ppe.gb'), // eslint-disable-line global-require
  locales: [
    {
      hostname: 'www-ppe.tesco.com',
      region: 'GB',
      languages: ['en-GB'],
    },
    {
      hostname: 'www-ppe.tesco.pl',
      region: 'PL',
      languages: ['pl-PL'],
    },
  ],
  log: {
    encryptionDisabled: false,
  },
  thirdParties: {
    active: true,
  },
  backToWhitelist: {
    en: [
      { url: 'https://secure-ppe.tesco.com/account/address-book/en-GB', label: 'Address book' },
      { url: 'https://www-ppe.tesco.com/account/address-book/en-GB', label: 'Address book' },
    ],
  },
  segmentation: {
    cookiePrefix: 'login_segment_',
    tests: [
      {
        name: 'verify',
        segments: [
          {
            name: 'disabled',
            weighting: 0,
          },
          {
            name: 'enabled',
            weighting: 100,
          },
        ],
        cookieOptions: {
          maxAge: 2629746000,
        },
      },
    ],
  },
};
