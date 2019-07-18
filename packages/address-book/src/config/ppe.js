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
};
