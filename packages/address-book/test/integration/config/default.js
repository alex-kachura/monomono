import { deferConfig as defer } from 'config/defer';
import { getLocalePhrase } from '../../../src/server/utils/i18n';
import { excludeFactory, onlyFactory } from '../utils/contexts/extensions';

module.exports = {
  // Import application configuration
  app: require('../../../src/config/default'), // eslint-disable-line global-require

  // Add named accounts as needed by adding a property for each new account per region needed.
  accounts: {
    GB: {
      default: {
        username: 'oneaccountPPETest.mytesco@emailsim.io',
        password: 'Password01',
        clubcard: '634004027884554580',
      },
    },
  },

  imageDiffThreshold: 0.005,

  // Execution of this function is deferred until all config files have been imported across all environment config
  // files.

  // For example if NODE_ENV is set to ppe: default is loaded first, then ppe. Once the configs have been merged then
  // context function is executed

  // This function parses the locales property in the app config and returns an array of context objects. A context
  // object is series of properties and app config for a region. This makes much easier to re-use application config
  // rather then duplicating settings in the test config.

  // Some of the application settings are exposed a primary properties just to be helpful.
  contexts: defer((config) => {
    const { basePath, appPath, protocol, locales } = config.app;

    // eslint-disable-next-line arrow-body-style
    return locales.map((locale) => {
      return {
        // Include local properties
        hostname: locale.hostname,
        region: locale.region,
        lang: locale.languages[0],

        // Include app, base and helpful constructs
        protocol,
        basePath,
        appPath,
        appUrl: `${protocol}${locale.hostname}/${basePath}/${appPath}/${locale.languages[0]}`,
        baseUrl: `${protocol}${locale.hostname}/${basePath}/${appPath}`,

        // Include utility functions.
        getLocalePhrase,
        exclude: excludeFactory(locale.region, locales),
        only: onlyFactory(locale.region, locales),

        // Include entire app config for easy access
        appConfig: config.app,
        accounts: config.accounts[locale.region],
      };
    });
  }),
};
