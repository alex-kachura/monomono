import cheerio from 'cheerio';
import { jar } from 'request';
import { getResponse, login } from '@oneaccount/test-common';

jest.setTimeout(30000);

describe.each(contexts())('Edit Page (/edit)', (context) => {
  const headers = { 'Content-Type': 'text/html', Accept: 'text/html' };

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
        response = await getResponse(`${appUrl}/edit`, {
          jar: cookieJar,
          headers,
        });
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('login page has loaded', () => {
        expect(response.request.href).toContain(externalApps.login);
      });
    });
  });

  // Context for these tests is limited to GB as PL links and login URLS etc
  // are unknown.
  describe.each(context.exclude([Region.PL]))(region, () => {
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

        response = await getResponse(`${appUrl}/edit`, {
          jar: cookieJar,
          headers,
        });

        $ = cheerio.load(response.body);
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('has loaded', () => {
        expect(response.request.href).toBe(`${appUrl}/edit`);
      });

      it('has a title', () => {
        const pageTitle = context.getLocalePhrase(context.lang, 'pages.edit.title');

        expect($('h1').text()).toContain(pageTitle);
      });

      it('has a sample field 1', () => {
        const fieldLabel = context.getLocalePhrase(context.lang, 'pages.edit.fields.sample1.label');

        expect($('label[for="sample1"]').text()).toContain(fieldLabel);
        expect($('input[id="sample1"]').attr('name')).toBe('sample1');
        expect($('input[id="sample1"]').attr('type')).toBe('text');
      });

      // Want to exclude test for sample field 2 as the PL version of the page does not contain it.
      it.each(context.exclude([Region.PL]))('has a sample field 2', () => {
        const fieldLabel = context.getLocalePhrase(context.lang, 'pages.edit.fields.sample2.label');

        expect($('label[for="sample2"]').text()).toContain(fieldLabel);
        expect($('input[id="sample2"]').attr('name')).toBe('sample2');
        expect($('input[id="sample2"]').attr('type')).toBe('text');
      });

      it('landing page contains a submit button', () => {
        const buttonTitle = context.getLocalePhrase(context.lang, 'pages.edit.submit-btn');

        expect($('span').text()).toContain(buttonTitle);
      });
    });

    // No post test for submit as it is designed to always fail to show workings of form validation.
  });
});
