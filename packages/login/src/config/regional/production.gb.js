module.exports = {
  externalApps: {
    tescoHomepage: 'https://www.tesco.com',
    tescoSecure: 'https://secure.tesco.com',
    login: 'https://secure.tesco.com/account/en-GB/login',
    logout: 'https://secure.tesco.com/account/en-GB/logout',
    register: 'https://secure.tesco.com/account/en-GB/register',
    myaccount: 'https://secure.tesco.com/account/en-GB/manage',
  },
  backToWhitelist: [
    {
      url: 'https://www.tesco.com/account/address-book/en-GB',
      label: 'back-to.address-book',
    },
    {
      url: 'https://www.tesco.com/account/personal-details/en-GB',
      label: 'back-to.personal-details',
    },
    {
      url: 'https://www.tesco.com/groceries',
      label: 'back-to.groceries',
    },
    {
      url: 'https://www.realfood.tesco.com',
      label: 'back-to.real-food',
    },
    {
      url: 'https://secure.tesco.com/clubcard/myaccount/home/home',
      label: 'back-to.mca',
    },
    {
      url: 'https://secure.tesco.com/clubcard',
      label: 'back-to.clubcard',
    },
    {
      url: 'https://www.tesco.com/deliverysaver',
      label: 'back-to.delivery-saver',
    },
  ],
  supportLinks: [
    {
      href: 'https://www.tesco.com/',
      text: 'tesco-site',
      glyph: 'home',
    },
    {
      href: 'https://www.tesco.com/help/contact/',
      text: 'contact-us',
      glyph: 'telephone',
    },
    {
      href: 'https://www.tesco.com/help/',
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
          href: 'https://www.tesco.com/help/',
        },
        {
          text: 'header1.link2',
          href: 'https://www.tesco.com/help/contact/',
        },
      ],
    },
    {
      header: 'header2.title',
      links: [
        {
          text: 'header2.link1',
          href: 'https://www.tesco.com/help/terms-and-conditions/',
        },
        {
          text: 'header2.link2',
          href:
            'https://www.tesco.com/help/privacy-and-cookies/privacy-centre/privacy-policy-information/privacy-policy/',
        },
        {
          text: 'header2.link3',
          href: 'https://www.tesco.com/help/accessibility/',
        },
        {
          text: 'header2.link4',
          href: 'https://www.tesco.com/help/privacy-and-cookies/privacy-centre/',
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
          href: 'https://www.tesco.com/store-locator/uk/',
        },
        {
          text: 'header3.link2',
          href: 'https://secure.tesco.com/account/en-GB/manage',
        },
        {
          text: 'header3.link3',
          href: 'https://www.tesco.com/productrecall/',
        },
        {
          text: 'header3.link4',
          href: 'https://www.tesco.com/help/site-map/',
        },
      ],
    },
    {
      header: 'header4.title',
      links: [
        {
          text: 'header4.link1',
          href: 'https://www.tesco-careers.com/',
        },
        {
          text: 'header4.link2',
          href: 'https://www.tescoplc.com/',
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
        href: 'https://www.tesco.com',
        id: 'utility-tesco',
        text: 'link1',
        useAltLink: true,
        'data-tracking': 'tesco.com',
      },
      {
        href: 'https://www.tesco.com/help/contact/',
        id: 'contact-us',
        text: 'link2',
        useAltLink: true,
        'data-tracking': 'contact',
      },
      {
        hasPopup: true,
        href: 'https://www.tesco.com/help/',
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
};
