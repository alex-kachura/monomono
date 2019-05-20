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
  pages: {
    'delivery-address': {
      fields: [
        {
          id: 'address-id',
          name: 'address-id',
          type: 'text',
          label: 'address.fields.address-id.label',
          xtype: 'address',
          placeholder: 'address.fields.address-id.placeholder',
          valuePath: 'id',
          hidden: true,
          required: false,
        },
        {
          id: 'postcode',
          name: 'postcode',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.postcode.label',
          placeholder: 'address.fields.postcode.placeholder',
          valuePath: 'postcode',
          required: true,
        },
        {
          id: 'address-line1',
          name: 'address-line1',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line1.label',
          placeholder: 'address.fields.address-line1.placeholder',
          valuePath: '1',
          required: true,
        },
        {
          id: 'address-line2',
          name: 'address-line2',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line2.label',
          placeholder: 'address.fields.address-line2.placeholder',
          valuePath: '2',
          required: false,
        },
        {
          id: 'address-line3',
          name: 'address-line3',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line3.label',
          placeholder: 'address.fields.address-line3.placeholder',
          valuePath: '3',
          required: false,
        },
        {
          id: 'town',
          name: 'town',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.town.label',
          placeholder: 'address.fields.town.placeholder',
          valuePath: 'postTown',
          required: true,
        },
        {
          id: 'day-number',
          name: 'day',
          type: 'tel',
          label: 'pages.delivery-address.fields.day-number.label',
          placeholder: 'pages.delivery-address.fields.day-number.placeholder',
          required: true,
        },
        {
          id: 'evening-number',
          name: 'evening',
          type: 'tel',
          label: 'pages.delivery-address.fields.evening-number.label',
          placeholder: 'pages.delivery-address.fields.evening-number.placeholder',
          required: true,
        },
        {
          id: 'mobile-number',
          name: 'mobile',
          type: 'tel',
          label: 'pages.delivery-address.fields.mobile-number.label',
          placeholder: 'pages.delivery-address.fields.mobile-number.placeholder',
          required: false,
        },
        {
          id: 'address-label',
          name: 'address-label',
          type: 'text',
          label: 'pages.delivery-address.fields.address-nickname.label',
          placeholder: 'pages.delivery-address.fields.address-nickname.placeholder',
          tooltip: 'pages.delivery-address.fields.address-nickname.tooltip',
          required: true,
        },
      ],
      schema: {
        type: 'object',
        required: ['postcode', 'address-line1', 'town', 'day', 'evening', 'address-label'],
        properties: {
          'address-id': {
            type: 'string',
            errorMessage: 'address.fields.address-id.error',
          },
          postcode: {
            type: 'string',
            pattern: '^\\s*[A-Za-z]{1,2}[0-9][0-9A-Za-z]?\\s?[0-9][A-Za-z]{2}\\s*$',
            errorMessage: 'address.fields.postcode.error',
          },
          'address-line1': {
            type: 'string',
            errorMessage: 'address.fields.address-line1.error',
          },
          'address-line2': {
            type: 'string',
            errorMessage: 'address.fields.address-line2.error',
          },
          'address-line3': {
            type: 'string',
            errorMessage: 'address.fields.address-line3.error',
          },
          town: {
            type: 'string',
            errorMessage: 'address.fields.town.error',
          },
          day: {
            type: 'string',
            maxLength: 20,
            pattern:
              '^(((0044\\(0\\)|\\+44\\(0\\)|00440|\\(\\+44\\)|\\(0044\\)|\\+44|0044|440|0)[1235789]((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{2}\\s\\d{4}\\s\\d{4})|(\\d{2}\\s\\d{6})|(\\d{3}\\s\\d{5})|(\\d{3}\\s\\d{6})|(\\d{4}\\s\\d{5})|(\\d{4}\\s\\d{4})|(\\d{8})))|((0044\\(0\\)7|\\+44\\(0\\)|004407|\\(\\+44\\)7|\\(0044\\)7|\\+447|00447|4407|07)((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\s?\\d{3}\\s?\\d{6})|(\\d{4}\\s?\\d{5}))))$', // eslint-disable-line max-len
            errorMessage: 'pages.delivery-address.fields.day-number.error',
          },
          evening: {
            type: 'string',
            maxLength: 20,
            pattern:
              '^(((0044\\(0\\)|\\+44\\(0\\)|00440|\\(\\+44\\)|\\(0044\\)|\\+44|0044|440|0)[1235789]((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{2}\\s\\d{4}\\s\\d{4})|(\\d{2}\\s\\d{6})|(\\d{3}\\s\\d{5})|(\\d{3}\\s\\d{6})|(\\d{4}\\s\\d{5})|(\\d{4}\\s\\d{4})|(\\d{8})))|((0044\\(0\\)7|\\+44\\(0\\)|004407|\\(\\+44\\)7|\\(0044\\)7|\\+447|00447|4407|07)((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\s?\\d{3}\\s?\\d{6})|(\\d{4}\\s?\\d{5}))))$', // eslint-disable-line max-len
            errorMessage: 'pages.delivery-address.fields.evening-number.error',
          },
          mobile: {
            type: 'string',
            maxLength: 20,
            pattern:
              '^(((0044\\(0\\)|\\+44\\(0\\)|00440|\\(\\+44\\)|\\(0044\\)|\\+44|0044|440|0)[1235789]((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{2}\\s\\d{4}\\s\\d{4})|(\\d{2}\\s\\d{6})|(\\d{3}\\s\\d{5})|(\\d{3}\\s\\d{6})|(\\d{4}\\s\\d{5})|(\\d{4}\\s\\d{4})|(\\d{8})))|((0044\\(0\\)7|\\+44\\(0\\)|004407|\\(\\+44\\)7|\\(0044\\)7|\\+447|00447|4407|07)((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\s?\\d{3}\\s?\\d{6})|(\\d{4}\\s?\\d{5}))))$', // eslint-disable-line max-len
            errorMessage: 'pages.delivery-address.fields.mobile-number.error',
          },
          'address-label': {
            type: 'string',
            maxLength: 30,
            errorMessage: 'pages.delivery-address.fields.address-nickname.error',
          },
        },
        additionalProperties: false,
        errorMessage: {
          required: {
            postcode: 'address.fields.postcode.error',
            'address-line1': 'address.fields.address-line1.error',
            town: 'address.fields.town.error',
            day: 'pages.delivery-address.fields.day-number.error',
            evening: 'pages.delivery-address.fields.evening-number.error',
            'address-label': 'pages.delivery-address.fields.address-nickname.error',
          },
        },
      },
    },
    'clubcard-address': {
      fields: [
        {
          id: 'address-id',
          name: 'address-id',
          type: 'text',
          label: 'address.fields.address-id.label',
          xtype: 'address',
          placeholder: 'address.fields.address-id.placeholder',
          valuePath: 'id',
          hidden: true,
          required: false,
        },
        {
          id: 'postcode',
          name: 'postcode',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.postcode.label',
          placeholder: 'address.fields.postcode.placeholder',
          valuePath: 'postcode',
          required: true,
        },
        {
          id: 'address-line1',
          name: 'address-line1',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line1.label',
          placeholder: 'address.fields.address-line1.placeholder',
          valuePath: '1',
          required: true,
        },
        {
          id: 'address-line2',
          name: 'address-line2',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line2.label',
          placeholder: 'address.fields.address-line2.placeholder',
          valuePath: '2',
          required: false,
        },
        {
          id: 'address-line3',
          name: 'address-line3',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.address-line3.label',
          placeholder: 'address.fields.address-line3.placeholder',
          valuePath: '3',
          required: false,
        },
        {
          id: 'town',
          name: 'town',
          type: 'text',
          xtype: 'address',
          label: 'address.fields.town.label',
          placeholder: 'address.fields.town.placeholder',
          valuePath: 'postTown',
          required: true,
        },
        {
          id: 'phone-number',
          name: 'phone',
          type: 'tel',
          label: 'pages.clubcard-address.fields.phone-number.label',
          placeholder: 'pages.clubcard-address.fields.phone-number.placeholder',
          required: true,
        },
      ],
      schema: {
        type: 'object',
        required: ['postcode', 'address-line1', 'town', 'phone'],
        properties: {
          'address-id': {
            type: 'string',
            errorMessage: 'address.fields.address-id.error',
          },
          postcode: {
            type: 'string',
            pattern: '^\\s*[A-Za-z]{1,2}[0-9][0-9A-Za-z]?\\s?[0-9][A-Za-z]{2}\\s*$',
            errorMessage: 'address.fields.postcode.error',
          },
          'address-line1': {
            type: 'string',
            errorMessage: 'address.fields.address-line1.error',
          },
          'address-line2': {
            type: 'string',
            errorMessage: 'address.fields.address-line2.error',
          },
          'address-line3': {
            type: 'string',
            errorMessage: 'address.fields.address-line3.error',
          },
          town: {
            type: 'string',
            errorMessage: 'address.fields.town.error',
          },
          phone: {
            type: 'string',
            pattern:
              '^(((0044\\(0\\)|\\+44\\(0\\)|00440|\\(\\+44\\)|\\(0044\\)|\\+44|0044|440|0)[1235789]((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{2}\\s\\d{4}\\s\\d{4})|(\\d{2}\\s\\d{6})|(\\d{3}\\s\\d{5})|(\\d{3}\\s\\d{6})|(\\d{4}\\s\\d{5})|(\\d{4}\\s\\d{4})|(\\d{8})))|((0044\\(0\\)7|\\+44\\(0\\)|004407|\\(\\+44\\)7|\\(0044\\)7|\\+447|00447|4407|07)((\\d{1}\\s?\\d{4}\\s?\\d{4})|(\\d{2}\\s?\\d{3}\\s?\\d{4})|(\\d{3}\\s\\d{3}\\s\\d{3})|(\\s?\\d{3}\\s?\\d{6})|(\\d{4}\\s?\\d{5}))))$', // eslint-disable-line max-len
            maxLength: 20,
            errorMessage: 'pages.clubcard-address.fields.phone-number.error',
          },
        },
        additionalProperties: false,
        errorMessage: {
          required: {
            postcode: 'address.fields.postcode.error',
            'address-line1': 'address.fields.address-line1.error',
            town: 'address.fields.town.error',
            phone: 'pages.clubcard-address.fields.phone-number.error',
          },
        },
      },
    },
  },
};
