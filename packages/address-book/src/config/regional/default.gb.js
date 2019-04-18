module.exports = {
  externalApps: {
    tescoHomepage: 'https://www-local.tesco.com',
    tescoSecure: 'https://secure-local.tesco.com',
    login: 'https://www-local.tesco.com/account/en-GB/login',
    logout: 'https://www-local.tesco.com/account/en-GB/logout',
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
    {
      id: 'sample2',
      name: 'sample2',
      label: 'pages.edit.fields.sample2.label',
      isValid: true,
      value: '',
      type: 'input',
      constraints: [
        {
          type: 'mandatory',
          text: 'pages.edit.fields.sample2.errors.empty',
          validator: true,
          isValid: true,
        },
        {
          type: 'regex',
          text: 'pages.edit.fields.sample2.errors.invalid',
          validationRegex: '^\\d+$',
          isValid: true,
        },
      ],
    },
  ],
  schema: {
    type: 'object',
    required: ['name', 'age', 'password', 'confirmPassword', 'postcode', 'address-line1', 'town'],
    properties: {
      name: {
        type: 'string',
        errorMessage: {
          type: 'Name must be a string',
        },
      },
      age: {
        type: 'integer',
        errorMessage: 'Must be a integer',
      },
      password: {
        type: 'string',
      },
      confirmPassword: {
        type: 'string',
        const: {
          $data: '1/password',
        },
        errorMessage: 'Password must match',
      },
      postcode: {
        type: 'string',
        errorMessage: {
          type: 'Postal Code must be a string',
        },
      },
      'address-line1': {
        type: 'string',
        errorMessage: {
          type: 'Address Line 1 must be a string',
        },
      },
      'address-line2': { type: 'string' },
      'address-line3': { type: 'string' },
      town: {
        type: 'string',
        errorMessage: {
          type: 'Address Line 1 must be a string',
        },
      },
      'address-id': {
        type: 'string',
        errorMessage: {
          type: 'must be a string',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        name: 'Name is required',
        age: 'Age is required',
        password: 'Password is required',
        confirmPassword: 'Confirm Password is required',
        postcode: 'Postalcode is required',
        'address-line1': 'Address Line 1 is required',
        town: 'Town is required',
      },
    },
  },
};
