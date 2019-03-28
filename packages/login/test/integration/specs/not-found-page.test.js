import cheerio from 'cheerio';
import { jar } from 'request';
import { getResponse, login, getLinkHrefWithLinkText } from '@oneaccount/test-common';

jest.setTimeout(30000);

describe.each(contexts())('Not Found Page (/not-found)', (context) => {
  const { getLocalePhrase, region, lang, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];

  const headers = {
    'Content-Type': 'text/html',
    Accept: 'text/html',
  };
  let cookieJar;
  let response;
  let $;

  describe('should redirect to login page when unauthenticated', () => {
    beforeAll(async () => {
      cookieJar = jar();
      response = await getResponse(`${appUrl}/not-found`, { jar: cookieJar, headers });
      $ = cheerio.load(response.body);
    });

    it('has a status code of 404', () => {
      expect(response.statusCode).toBe(404);
    });

    it('has link to Homepage', () => {
      // Get the appropriate localised phrase for the Tesco homepage link
      const homepageLinkPhrase = getLocalePhrase(lang, 'pages.not-found.home');

      // Using the app's own config validate that the link phrase is present
      expect(getLinkHrefWithLinkText($, homepageLinkPhrase)).toBe(externalApps.tescoHomepage);
    });
  });

  describe('should render page when authenticated', () => {
    beforeAll(async () => {
      cookieJar = jar();

      await login(
        context.accounts.default.username,
        context.accounts.default.password,
        cookieJar,
        externalApps.login,
        {
          headers,
        },
      );

      response = await getResponse(`${appUrl}/not-found`, { jar: cookieJar, headers });

      $ = cheerio.load(response.body);
    });

    it('has a status code of 404', () => {
      expect(response.statusCode).toBe(404);
    });

    it('has link to Homepage', () => {
      // Get the appropriate localised phrase for the Tesco homepage link
      const homepageLinkPhrase = getLocalePhrase(lang, 'pages.not-found.home');

      // Using the app's own config validate that the link phrase is present
      expect(getLinkHrefWithLinkText($, homepageLinkPhrase)).toBe(externalApps.tescoHomepage);
    });
  });
});
