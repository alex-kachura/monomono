module.exports = {
  externalApps: {
    tescoHomepage: 'https://www-local.tesco.pl',
    // Leaving these empty means the app will allow access for all users.
    // This is in place to allow the boilerplate to be used for non-English
    // languages until the respective login/logout endpoints are ready for that country.
    login: '',
    logout: '',
  },
  supportLinks: [
    {
      href: 'https://www-local.tesco.pl/',
      text: 'tesco-site',
      glyph: 'home',
    },
    {
      href: 'https://www-local.tesco.pl/help/contact/',
      text: 'contact-us',
      glyph: 'telephone',
    },
    {
      href: 'https://www-local.tesco.pl/help/',
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
          href: 'https://www-local.tesco.pl/help/',
        },
        {
          text: 'header1.link2',
          href: 'https://www-local.tesco.pl/help/contact/',
        },
      ],
    },
    {
      header: 'header2.title',
      links: [
        {
          text: 'header2.link1',
          href: 'https://www-local.tesco.pl/help/terms-and-conditions/',
        },
        {
          text: 'header2.link2',
          href:
            'https://www-local.tesco.pl/help/privacy-and-cookies/privacy-centre/privacy-policy-information/privacy-policy/',
        },
        {
          text: 'header2.link3',
          href: 'https://www-local.tesco.pl/help/accessibility/',
        },
        {
          text: 'header2.link4',
          href: 'https://www-local.tesco.pl/help/privacy-and-cookies/privacy-centre/',
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
          href: 'https://www-local.tesco.pl/store-locator/uk/',
        },
        {
          text: 'header3.link2',
          href: 'https://secure.tesco.pl/account/en-GB/manage',
        },
        {
          text: 'header3.link3',
          href: 'https://www-local.tesco.pl/productrecall/',
        },
        {
          text: 'header3.link4',
          href: 'https://www-local.tesco.pl/help/site-map/',
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
        href: 'https://www-local.tesco.pl',
        id: 'utility-tesco',
        text: 'link1',
        useAltLink: true,
        'data-tracking': 'tesco.pl',
      },
      {
        href: 'https://www-local.tesco.pl/help/contact/',
        id: 'contact-us',
        text: 'link2',
        useAltLink: true,
        'data-tracking': 'contact',
      },
      {
        hasPopup: true,
        href: 'https://www-local.tesco.pl/help/',
        id: 'help',
        text: 'link3',
        useAltLink: true,
        'data-tracking': 'help',
      },
    ],
    branding: {
      href: 'https://tesco.pl',
    },
    mobileMenuItem: {
      href: '/',
      text: 'header.menu.title',
    },
    selectedMenuItemID: 'utility-tesco',
  },
  fields: [
    {
      id: 'sample1',
      name: 'sample1',
      label: 'pages.edit.fields.sample1.label',
      isValid: true,
      value: '',
      type: 'input',
      constraints: [
        {
          type: 'mandatory',
          text: 'pages.edit.fields.sample1.errors.empty',
          validator: true,
          isValid: true,
        },
      ],
    },
  ],
};
