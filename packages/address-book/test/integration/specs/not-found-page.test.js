import cheerio from 'cheerio';
import { getResponse, getLinkHrefWithLinkText } from '@oneaccount/test-common';

const jar = global.jar;

const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

let response;
let $;

describe.each(contexts())('Not Found Page (/not-found)', (context) => {
  const { getLocalePhrase, region, lang, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];

  describe(region, () => {
    beforeAll(async () => {
      response = await getResponse(`${appUrl}/not-found`, { jar, headers });
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
