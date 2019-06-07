import cheerio from 'cheerio';
import { getResponse, extractStateAndHiddenCsfr } from '@oneaccount/test-common';

const jar = global.jar;
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
const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

let response;
let $;

describe.each(contexts())('Add Delivery Address Page', (context) => {
  const { region, appUrl } = context;
  const addPageUrl = `${appUrl}/add-delivery-address`;

  async function loadPage(url) {
    response = await getResponse(url, { jar, headers });
    $ = cheerio.load(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.request.href).toBe(url);
  }

  async function submitForm(formData) {
    const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

    return getResponse(addPageUrl, {
      method: 'POST',
      jar,
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

    return getResponse(appUrl, {
      method: 'POST',
      jar,
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

  describe(region, () => {
    describe('Page render', () => {
      beforeAll(async () => {
        await loadPage(addPageUrl);
      });

      it('should contain correct page title', () => {
        const pageTitle = context.getLocalePhrase(context.lang, 'pages.delivery-address.add.title');

        expect($('h1').text()).toContain(pageTitle);
      });
    });

    describe('Functionality', () => {
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
          await loadPage(addPageUrl);
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
          await loadPage(addPageUrl);
          response = await submitForm({
            ...defaultFormFields,
            'address-label': "Work's",
          });
        });

        it('should load successfully', async () => {
          expect(response.statusCode).toBe(200);
          expect(response.request.href).toBe(`${appUrl}?action=added`);
        });
      });

      describe('POST an address with more than 30 characters', () => {
        beforeAll(async () => {
          await loadPage(addPageUrl);
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
