module.exports = {
  externalApps: {
    tescoHomepage: 'https://www-ppe.tesco.com',
    tescoSecure: 'https://secure-ppe.tesco.com',
    login: 'https://secure-ppe.tesco.com/account/en-GB/login',
    logout: 'https://sercure-ppe.tesco.com/account/en-GB/logout',
    register: 'https://secure-ppe.tesco.com/account/en-GB/register',
    verify: 'https://www-ppe.tesco.com/account/login/en-GB/verify',
    accountAddressBook: 'https://secure-ppe.tesco.com/account/en-GB/manage/address-book',
    accountAddressBookAddAddress:
      'https://secure-ppe.tesco.com/account/en-GB/manage/address-book/add-address',
    accountAddressBookEditAddress:
      'https://secure-ppe.tesco.com/account/en-GB/manage/address-book/change-address',
  },
  supportLinks: [
    {
      href: 'https://www-ppe.tesco.com/',
      text: 'tesco-site',
      glyph: 'home',
    },
    {
      href: 'https://www-ppe.tesco.com/help/contact/',
      text: 'contact-us',
      glyph: 'telephone',
    },
    {
      href: 'https://www-ppe.tesco.com/help/',
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
          href: 'https://www-ppe.tesco.com/help/',
        },
        {
          text: 'header1.link2',
          href: 'https://www-ppe.tesco.com/help/contact/',
        },
      ],
    },
    {
      header: 'header2.title',
      links: [
        {
          text: 'header2.link1',
          href: 'https://www-ppe.tesco.com/help/terms-and-conditions/',
        },
        {
          text: 'header2.link2',
          href:
            'https://www-ppe.tesco.com/help/privacy-and-cookies/privacy-centre/privacy-policy-information/privacy-policy/',
        },
        {
          text: 'header2.link3',
          href: 'https://www-ppe.tesco.com/help/accessibility/',
        },
        {
          text: 'header2.link4',
          href: 'https://www-ppe.tesco.com/help/privacy-and-cookies/privacy-centre/',
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
          href: 'https://www-ppe.tesco.com/store-locator/uk/',
        },
        {
          text: 'header3.link2',
          href: 'https://secure-ppe.tesco.com/account/en-GB/manage',
        },
        {
          text: 'header3.link3',
          href: 'https://www-ppe.tesco.com/productrecall/',
        },
        {
          text: 'header3.link4',
          href: 'https://www-ppe.tesco.com/help/site-map/',
        },
      ],
    },
    {
      header: 'header4.title',
      links: [
        {
          text: 'header4.link1',
          href: 'https://www-ppe.tesco-careers.com/',
        },
        {
          text: 'header4.link2',
          href: 'https://www-ppe.tescoplc.com/',
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
        href: 'https://www-ppe.tesco.com',
        id: 'utility-tesco',
        text: 'link1',
        useAltLink: true,
        'data-tracking': 'tesco.com',
      },
      {
        href: 'https://www-ppe.tesco.com/help/contact/',
        id: 'contact-us',
        text: 'link2',
        useAltLink: true,
        'data-tracking': 'contact',
      },
      {
        hasPopup: true,
        href: 'https://www-ppe.tesco.com/help/',
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
