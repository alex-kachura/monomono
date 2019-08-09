import cheerio from 'cheerio';
import { getResponse } from '@oneaccount/test-common';

const jar = global.jar;

const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

let response;
let $;

describe.each(contexts())('Landing Page (/)', (context) => {
  const { appUrl, region } = context;

  describe(region, () => {
    beforeAll(async () => {
      response = await getResponse(`${appUrl}/`, { jar, headers });

      $ = cheerio.load(response.body);
    });

    it('should load successfully', () => {
      expect(response.statusCode).toBe(200);
      expect(response.request.href).toBe(`${appUrl}/`);
    });

    it('should contain correct page title', () => {
      const pageTitle = context.getLocalePhrase(context.lang, 'pages.landing.title');

      expect($('h1').text()).toContain(pageTitle);
    });

    it('should contain Clubcard address', () => {
      const clubcardAddressTitle = context.getLocalePhrase(
        context.lang,
        'pages.landing.primary-address.header.clubcard',
      );

      expect($('h5').text()).toContain(clubcardAddressTitle);
    });

    it('should contain Delivery Address', () => {
      const groceryAddressTitle = context.getLocalePhrase(
        context.lang,
        'pages.landing.primary-address.header.grocery',
      );

      expect($('h5').text()).toContain(groceryAddressTitle);
    });
  });
});
