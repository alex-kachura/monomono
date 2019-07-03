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
      {
        url: 'https://secure-ppe.tesco.com/account/address-book/en-GB',
        label: 'back-to.address-book',
      },
      {
        url: 'https://www-ppe.tesco.com/account/address-book/en-GB',
        label: 'back-to.address-book',
      },
      {
        url: 'https://www-ppe.tesco.com/groceries',
        label: 'back-to.groceries',
      },
      {
        url: 'https://www-ppe.realfood.tesco.com',
        label: 'back-to.real-food',
      },
      {
        url: 'https://secure-ppe.tesco.com/clubcard/myaccount/home/home',
        label: 'back-to.mca',
      },
      {
        url: 'https://secure-ppe.tesco.com/clubcard',
        label: 'back-to.clubcard',
      },
      {
        url: 'https://www-ppe.tesco.com/deliverysaver',
        label: 'back-to.delivery-saver',
      },
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
