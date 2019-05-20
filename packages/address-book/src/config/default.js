module.exports = {
  // Import regional specific development environment config
  GB: require('./regional/default.gb'), // eslint-disable-line global-require
  PL: require('./regional/default.pl'), // eslint-disable-line global-require
  locales: [
    {
      hostname: 'www-local.tesco.com',
      region: 'GB',
      languages: ['en-GB'],
    },
    {
      hostname: 'www-local.tesco.pl',
      region: 'PL',
      languages: ['pl-PL'],
    },
  ],
  clientConfigWhitelist: [
    {
      key: 'basePath',
      scope: 'global',
    },
    {
      key: 'appPath',
      scope: 'global',
    },
    {
      key: 'externalApps',
      scope: 'regional',
    },
    {
      key: 'header',
      scope: 'regional',
    },
    {
      key: 'footerLinks',
      scope: 'regional',
    },
    {
      key: 'fields',
      scope: 'regional',
    },
  ],
  name: 'address-book',
  port: '8088',
  basePath: 'account',
  appPath: 'address-book',
  protocol: 'https://',
  log: {
    directory: '/home/node/log',
    filename: 'app',
    maxsize: 104857600,
    datePattern: '.yyyyMMddHH.log',
    encryptionKey: 'asdf',
    encryptionDisabled: true,
  },
  cookie: {
    tracer: {
      name: 'atrc',
      options: {
        secure: false,
        maxAge: 31536000000,
      },
    },
    CSRF: {
      name: '_csrf',
      httpOnly: true,
      secure: false,
    },
    UUID: {
      name: 'UUID',
      expires: '0',
      httpOnly: false,
      secure: false,
    },
    userAccessToken: {
      name: 'OAuth.AccessToken',
      expires: '3600000',
      httpOnly: true,
      secure: false,
    },
    userRefreshToken: {
      name: 'OAuth.RefreshToken',
      expires: '86400000',
      httpOnly: true,
      secure: false,
    },
    OAuthTokensExpiryTime: {
      name: 'OAuth.TokensExpiryTime',
      expires: '86400000',
      httpOnly: true,
      secure: false,
    },
    consumerid: {
      name: 'consumerid',
      httpOnly: true,
      secure: false,
    },
  },
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      '*.demdex.net',
      '*.adobedtm.com',
      '*.tt.omtrdc.net',
      '*.2o7.net',
      '*.tesco.com',
      '*.appdynamics.com',
    ],
    connectSrc: ["'self'", '*.eum-appdynamics.com'],
    styleSrc: ["'self'", "'unsafe-inline'", '*.tesco.com'],
    imgSrc: ["'self'", 'data:', '*.tesco.com'],
    fontSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    childSrc: ["'self'"],
    frameSrc: ['*.amazonaws.com'],
  },
  thirdParties: {
    active: false,
    dataLayer: {
      /* eslint-disable camelcase */
      cont_grp: 'address-book',
      cont_channel: 'mytesco',
      cont_server_env: 'wdc server 14',
      /* eslint-enable camelcase */
    },
    headerScript:
      '//assets.adobedtm.com/07f4803ba7577af91bd0d0bb989cce05e8f2a5c8/satelliteLib-f251c1b62e792f8a7591e302ce0f7780f6605d98-staging.js',
    footerScript: 'if (_satellite) { _satellite.pageBottom(); }',
  },
  appDynamics: {
    appKey: '',
  },
  backToWhitelist: {
    en: [],
  },
  services: {
    akamaiAuthToken: 'manadatoy-for-production-no-effect-ppe',
    clientId: 'trn:tesco:cid:3e78eec4-63d3-4e1d-9502-84f92a803715',
    fullyQualifiedClientId:
      'trn:tesco:cid:3e78eec4-63d3-4e1d-9502-84f92a803715:ba95c3d1-2919-42bb-958e-613501c7802a',
    identity: {
      host: 'api-ppe.tesco.com',
      port: '',
      protocol: 'https',
      username: 'MyTesco_Client',
      password: 'sweswes746',
      timeout: 20000,
    },
    profile: {
      host: 'api-ppe.tesco.com',
      port: '',
      protocol: 'https',
      timeout: 20000,
    },
    contact: {
      host: 'docker.for.mac.localhost',
      port: '8100',
      protocol: 'http',
      timeout: 20000,
    },
    address: {
      host: 'docker.for.mac.localhost',
      port: '8100',
      protocol: 'http',
      timeout: 20000,
    },
  },
};
