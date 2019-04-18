module.exports = {
  // Import regional specific ppe environment config
  GB: require('./regional/ppe.gb'), // eslint-disable-line global-require
  PL: require('./regional/ppe.pl'), // eslint-disable-line global-require
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
};
