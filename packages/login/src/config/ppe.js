module.exports = {
  // Import regional specific ppe environment config
  GB: require('./regional/ppe.gb'), // eslint-disable-line global-require
  locales: [
    {
      hostname: 'www-ppe.tesco.com',
      region: 'GB',
      languages: ['en-GB'],
    },
  ],
  log: {
    encryptionDisabled: false,
  },
  thirdParties: {
    active: true,
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
