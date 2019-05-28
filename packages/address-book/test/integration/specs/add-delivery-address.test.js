import cheerio from 'cheerio';
import { jar } from 'request';
import { getResponse, login, extractStateAndHiddenCsfr } from '@oneaccount/test-common';

jest.setTimeout(30000);

describe.each(contexts())('Add Delivery Address Page', (context) => {
  const headers = {
    'Content-Type': 'text/html',
    Accept: 'text/html',
  };

  let cookieJar;
  let response;

  const { region, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];
  const defaultFormFields = {
    'address-id': 'trn:tesco:address:address:uuid:36598ef5-8f13-4f77-abdc-f42328d0c1bf',
    postcode: 'EC1R 5AR',
    'address-line1': '85 Clerkenwell Road',
    'address-line2': '',
    'address-line3': '',
    town: 'LONDON',
    day: '01234567891',
    evening: '01234567891',
    mobile: '',
  };

  // Context for these tests is limited to GB as PL links and login URLS etc
  // are unknown.
  describe.each(contexts())(`${region} add delivery address`, () => {
    async function submitForm(formData) {
      const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

      return getResponse(`${appUrl}/add-delivery-address`, {
        method: 'POST',
        jar: cookieJar,
        followAllRedirects: true,
        form: {
          ...formData,
          state,
        },
        headers: {
          Accept: 'text/html',
          'csrf-token': hiddenCsrf,
        },
      });
    }

    async function deleteAddress(formData) {
      const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

      return getResponse(`${appUrl}/`, {
        method: 'POST',
        jar: cookieJar,
        followAllRedirects: true,
        form: {
          ...formData,
          state,
        },
        headers: {
          Accept: 'text/html',
          'csrf-token': hiddenCsrf,
        },
      });
    }

    describe('should redirect to login when unauthenticated', () => {
      beforeAll(async () => {
        cookieJar = jar();
        response = await getResponse(`${appUrl}/add-delivery-address`, { jar: cookieJar, headers });
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('login page has loaded', () => {
        expect(response.request.href).toContain(externalApps.login);
      });
    });

    describe('when authenticated', () => {
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
      });

      describe('should render page', () => {
        beforeAll(async () => {
          response = await getResponse(`${appUrl}/add-delivery-address`, {
            jar: cookieJar,
            headers,
          });

          $ = cheerio.load(response.body);
        });

        it('has a status code of 200', () => {
          expect(response.statusCode).toBe(200);
        });

        it('has loaded', () => {
          expect(response.request.href).toBe(`${appUrl}/add-delivery-address`);
        });

        it('contains a title', () => {
          const pageTitle = context.getLocalePhrase(
            context.lang,
            'pages.delivery-address.add.title',
          );

          expect($('h1').text()).toContain(pageTitle);
        });
      });
    });

    describe('when authenticated', () => {
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
      });

      afterEach(async () => {
        $ = cheerio.load(response.body);
        const contactAddressId = $('form:last-of-type input[name="contact-address-id"]').attr(
          'value',
        );

        if (contactAddressId) {
          await deleteAddress({ 'contact-address-id': contactAddressId });
        }
      });

      describe('POST new delivery address', () => {
        beforeAll(async () => {
          response = await getResponse(`${appUrl}/add-delivery-address`, {
            jar: cookieJar,
            headers,
          });

          response = await submitForm({
            ...defaultFormFields,
            'address-label': 'Work',
          });
        });

        it('successful', async () => {
          expect(response.statusCode).toBe(200);

          expect(response.request.href).toBe(`${appUrl}?action=added`);
        });
      });

      describe('POST new delivery address with apostrophe in label', () => {
        beforeAll(async () => {
          response = await getResponse(`${appUrl}/add-delivery-address`, {
            jar: cookieJar,
            headers,
          });

          response = await submitForm({
            ...defaultFormFields,
            'address-label': "Work's",
          });
        });

        it('successful', async () => {
          expect(response.statusCode).toBe(200);

          expect(response.request.href).toBe(`${appUrl}?action=added`);
        });
      });

      describe('POST an address with more than 30 characters', () => {
        beforeAll(async () => {
          response = await getResponse(`${appUrl}/add-delivery-address`, {
            jar: cookieJar,
            headers,
          });

          response = await submitForm({
            ...defaultFormFields,
            'address-label': 'This is a very very long address',
          });
        });

        it('should display an error message', async () => {
          $ = cheerio.load(response.body);

          expect($('#address-label-error').length).toBe(1);
        });
      });
    });
  });
});
