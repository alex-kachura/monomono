module.exports = {
  // Import regional specific production environment config
  GB: require('./regional/production.gb'), // eslint-disable-line global-require
  locales: [
    {
      hostname: 'www.tesco.com',
      region: 'GB',
      languages: ['en-GB'],
    },
    {
      hostname: 'www.tesco.pl',
      region: 'PL',
      languages: ['pl-PL'],
    },
  ],
  log: {
    encryptionDisabled: false,
  },
  services: {
    clientId: 'trn:tesco:cid:ea61a462-e6e3-4410-beb9-37abff5ded54',
    identity: {
      host: 'api.tesco.com',
    },
    profile: {
      host: 'api.tesco.com',
    },
    contact: {
      host: 'api.tesco.com',
    },
    address: {
      host: 'api.tesco.com',
    },
  },
  thirdParties: {
    active: true,
    headerScript:
      '//assets.adobedtm.com/07f4803ba7577af91bd0d0bb989cce05e8f2a5c8/satelliteLib-f251c1b62e792f8a7591e302ce0f7780f6605d98.js',
  },
};
