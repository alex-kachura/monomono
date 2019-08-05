module.exports = {
  externalApps: {
    tescoHomepage: 'https://www-local.tesco.com',
    tescoSecure: 'https://secure-ppe.tesco.com',
    login: 'https://www-local.tesco.com/account/en-GB/login',
    logout: 'https://www-local.tesco.com/account/en-GB/logout',
    register: 'https://www-local.tesco.com/account/en-GB/register',
    myaccount: 'https://secure-ppe.tesco.com/account/en-GB/manage',
  },
  supportLinks: [
    {
      href: 'https://www-local.tesco.com/',
      text: 'tesco-site',
      glyph: 'home',
    },
    {
      href: 'https://www-local.tesco.com/help/contact/',
      text: 'contact-us',
      glyph: 'telephone',
    },
    {
      href: 'https://www-local.tesco.com/help/',
      text: 'help',
      glyph: 'information',
    },
    {
      href: 'javascript:OOo.oo_launch();', // eslint-disable-line
      text: 'feedback',
    },
  ],
  footerLinks: [
    {
      header: 'header1.title',
      links: [
        {
          text: 'header1.link1',
          href: 'https://www-local.tesco.com/help/',
        },
        {
          text: 'header1.link2',
          href: 'https://www-local.tesco.com/help/contact/',
        },
      ],
    },
    {
      header: 'header2.title',
      links: [
        {
          text: 'header2.link1',
          href: 'https://www-local.tesco.com/help/terms-and-conditions/',
        },
        {
          text: 'header2.link2',
          href:
            'https://www-local.tesco.com/help/privacy-and-cookies/privacy-centre/privacy-policy-information/privacy-policy/',
        },
        {
          text: 'header2.link3',
          href: 'https://www-local.tesco.com/help/accessibility/',
        },
        {
          text: 'header2.link4',
          href: 'https://www-local.tesco.com/help/privacy-and-cookies/privacy-centre/',
        },
        {
          text: 'header2.link5',
          // eslint-disable-next-line no-script-url
          href: 'javascript:OOo.oo_launch();',
        },
      ],
    },
    {
      header: 'header3.title',
      links: [
        {
          text: 'header3.link1',
          href: 'https://www-local.tesco.com/store-locator/uk/',
        },
        {
          text: 'header3.link2',
          href: 'https://secure.tesco.com/account/en-GB/manage',
        },
        {
          text: 'header3.link3',
          href: 'https://www-local.tesco.com/productrecall/',
        },
        {
          text: 'header3.link4',
          href: 'https://www-local.tesco.com/help/site-map/',
        },
      ],
    },
    {
      header: 'header4.title',
      links: [
        {
          text: 'header4.link1',
          href: 'https://www-local.tesco-careers.com/',
        },
        {
          text: 'header4.link2',
          href: 'https://www-local.tescoplc.com/',
        },
      ],
    },
  ],
  socialLinks: [
    {
      graphic: 'facebook',
      href: 'https://www.facebook.com/tesco/',
    },
    {
      graphic: 'twitter',
      href: 'https://twitter.com/tesco',
    },
    {
      graphic: 'pinterest',
      href: 'https://pinterest.com/tesco/',
    },
    {
      graphic: 'youtube',
      href: 'https://www.youtube.com/tesco',
    },
    {
      graphic: 'instagram',
      href: 'https://www.instagram.com/tescofood/?hl=en',
    },
  ],
  header: {
    menu: [
      {
        href: 'https://www-local.tesco.com',
        id: 'utility-tesco',
        text: 'link1',
        useAltLink: true,
        'data-tracking': 'tesco.com',
      },
      {
        href: 'https://www-local.tesco.com/help/contact/',
        id: 'contact-us',
        text: 'link2',
        useAltLink: true,
        'data-tracking': 'contact',
      },
      {
        hasPopup: true,
        href: 'https://www-local.tesco.com/help/',
        id: 'help',
        text: 'link3',
        useAltLink: true,
        'data-tracking': 'help',
      },
      {
        id: 'appbar-feedback',
        href: 'javascript:OOo.oo_launch();', // eslint-disable-line
        text: 'link4',
        'data-tracking': 'feedback',
      },
    ],
    branding: {
      href: 'https://tesco.com',
    },
    mobileMenuItem: {
      href: '/',
      text: 'header.menu.title',
    },
    selectedMenuItemID: 'utility-tesco',
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      digit11: {
        type: 'integer',
        maxLength: 1,
      },
      digit12: {
        type: 'integer',
        maxLength: 1,
      },
      digit13: {
        type: 'integer',
        maxLength: 1,
      },
      digit14: {
        type: 'integer',
        maxLength: 1,
      },
    },
    additionalProperties: false,
    oneOf: [
      { required: ['digit11', 'digit12', 'digit13'] },
      { required: ['digit11', 'digit12', 'digit14'] },
      { required: ['digit11', 'digit13', 'digit14'] },
      { required: ['digit12', 'digit13', 'digit14'] },
    ],
  },
};
