module.exports = {
  // Import application configuration (override that imported by default.js)
  app: require('../../../src/config/production'), // eslint-disable-line global-require

  // Add named accounts as needed by adding a property for each new account per region needed.
  accounts: {
    GB: {
      default: {
        username: 'oneaccountProdTest@emailsim.io',
        password: 'Password01',
        clubcard: '634004027673259011',
      },
    },
    PL: {
      // None at the moment for Poland. Something the pop up team will need to
      // look into.
    },
  },
};
