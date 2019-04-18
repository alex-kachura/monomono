module.exports = {
  testRunner: {
    host: 'hub.browserstack.com',
    port: 80,
    user: process.env.BROWSERSTACK_USERNAME || 'garyalway2',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'fjYsLm4TV8xA7H5oDhM7',
    logLevel: 'silent',
    timeout: 10000,
    desiredCapabilities: {
      browser: 'Chrome',
      os: 'OS X',
      os_version: 'El Capitan', // eslint-disable-line camelcase
      project: 'One Account UI',
      'browserstack.local': 'true',
      'browserstack.localIdentifier': process.env.ID,
    },
  },
};
