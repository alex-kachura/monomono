import cheerio from 'cheerio';
import { jar } from 'request';
import { getResponse, login } from '@oneaccount/test-common';

jest.setTimeout(30000);

describe.each(contexts())('Landing Page (/)', (context) => {
  const headers = {
    'Content-Type': 'text/html',
    Accept: 'text/html',
  };

  let cookieJar;
  let response;

  const { region, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];

  // Context for these tests is limited to GB as PL links and login URLS etc
  // are unknown.
  describe.each(context.exclude([Region.PL]))(region, () => {
    describe('should redirect to login when unauthenticated', () => {
      beforeAll(async () => {
        cookieJar = jar();
        response = await getResponse(`${appUrl}/`, { jar: cookieJar, headers });
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('login page has loaded', () => {
        expect(response.request.href).toContain(externalApps.login);
      });
    });

    describe('should render page when authenticated', () => {
      let $;

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

        response = await getResponse(`${appUrl}/`, { jar: cookieJar, headers });

        $ = cheerio.load(response.body);
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('landing page has loaded', () => {
        expect(response.request.href).toBe(`${appUrl}/`);
      });

      it('landing page contains a title', () => {
        const pageTitle = context.getLocalePhrase(context.lang, 'pages.landing.title');

        expect($('h1').text()).toContain(pageTitle);
      });

      it('landing page contains a submit form button', () => {
        const buttonTitle = context.getLocalePhrase(context.lang, 'pages.landing.sample-form-btn');
        const relativeAppPath = `/${context.basePath}/${context.appPath}/${context.lang}`;

        expect($('span').text()).toContain(buttonTitle);
        expect($(`a[href='${relativeAppPath}/edit']`).length).toBe(1);
      });
    });
  });
});
