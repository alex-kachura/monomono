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

  describe('Non inline mode', () => {
    describe(region, () => {
      beforeAll(async () => {
        response = await getResponse(`${appUrl}/`, { jar, headers });

        $ = cheerio.load(response.body);
      });

      it('should load successfully', () => {
        expect(response.statusCode).toBe(200);
        expect(response.request.href).toBe(`${appUrl}/`);
      });

      it('should have a header', () => {
        expect($('header').length).toBe(1);
      });

      it('should have a footer', () => {
        expect($('footer').length).toBe(1);
      });

      it('should have a breadcrumb', () => {
        expect($('nav[aria-label=breadcrumb]').length).toBe(1);
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
  describe('Inline mode', () => {
    beforeAll(async () => {
      response = await getResponse(`${appUrl}?consumer='test'`, { jar, headers });
      $ = cheerio.load(response.body);
    });

    it('should load successfully', () => {
      expect(response.statusCode).toBe(200);
    });

    it('should not have a header', () => {
      expect($('header').length).toBe(0);
    });

    it('should not have a footer', () => {
      expect($('footer').length).toBe(0);
    });

    it('should not have a breadcrumb', () => {
      expect($('nav[aria-label=breadcrumb]').length).toBe(0);
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
