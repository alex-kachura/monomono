module.exports = {
  testRunner: {
    selenium: {
      host: '127.0.0.1',
      port: 4444,
      timeout: 30000,
    },
    desiredCapabilities: {
      browserName: 'chrome',
    },
  },
};
