import cheerio from 'cheerio';
import { getResponse, extractStateAndHiddenCsfr } from '@oneaccount/test-common';

const jar = global.jar;

const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

const defaultFormFields = {
  'address-id': 'trn:tesco:address:address:uuid:1ed74c15-b204-4d66-8a90-c22f3b7c05f2',
  'address-label': 'test',
  'address-line1': 'Tesco Stores Ltd',
  'address-line2': 'Progress House',
  'address-line3': 'Shire Park',
  day: '01234567891',
  evening: '01234567891',
  mobile: '',
  postcode: 'AL7 1GB',
  town: 'WELWYN GARDEN CITY',
};

let response;
let $;

describe.each(contexts())('Edit Delivery Address Page', (context) => {
  const { lang, region, appUrl, getLocalePhrase } = context;

  async function loadPage(url) {
    response = await getResponse(url, { jar, headers });
    $ = cheerio.load(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.request.href).toBe(url);
  }

  async function submitForm(pageURL, formData) {
    const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

    return getResponse(pageURL, {
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

  function getHiddenInputs() {
    $ = cheerio.load(response.body);

    return $('form input[name="contact-address-id"]');
  }

  async function addDeliveryAddress() {
    await loadPage(appUrl);

    const initial = getHiddenInputs().length;
    const addAddressURL = `${appUrl}/add-delivery-address`;

    await loadPage(addAddressURL);
    response = await submitForm(addAddressURL, defaultFormFields);

    expect(response.statusCode).toBe(200);

    await loadPage(appUrl);

    expect(getHiddenInputs().length).toBeGreaterThan(initial);
  }

  async function deleteAddress(formData) {
    const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

    response = await getResponse(appUrl, {
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

    expect(response.statusCode).toBe(200);
  }

  async function getLastAddressId() {
    await loadPage(appUrl);

    return getHiddenInputs()
      .last()
      .attr('value');
  }

  async function editLastAddress(addressData) {
    const contactAddressId = await getLastAddressId();

    expect(contactAddressId).toBeDefined();

    const editAddressURL = `${appUrl}/edit-delivery-address?id=${contactAddressId}`;

    await loadPage(editAddressURL);

    response = await submitForm(editAddressURL, addressData);
    $ = cheerio.load(response.body);
  }

  async function deleteLastAddress() {
    const contactAddressId = await getLastAddressId();

    await deleteAddress({ 'contact-address-id': contactAddressId });
  }

  describe(region, () => {
    beforeAll(async () => {
      await addDeliveryAddress();
    });

    describe('Page render', () => {
      beforeAll(async () => {
        const contactAddressId = await getLastAddressId();

        expect(contactAddressId).toBeDefined();

        const editAddressURL = `${appUrl}/edit-delivery-address?id=${contactAddressId}`;

        await loadPage(editAddressURL);
      });

      it('should contain correct page title', async () => {
        const pageTitle = getLocalePhrase(lang, 'pages.delivery-address.edit.title');

        expect($('h1').text()).toContain(pageTitle);
      });
    });

    describe('POST edit delivery address', () => {
      const addressesFields = [{ 'address-label': 'Work' }, { 'address-label': "Work's" }];

      describe.each(addressesFields)('valid address: %p', (addressFields) => {
        beforeAll(async () => {
          await editLastAddress({
            ...defaultFormFields,
            ...addressFields,
          });
        });

        it('should be successful', () => {
          expect(response.statusCode).toBe(200);
          expect(response.request.href).toBe(`${appUrl}?action=updated`);
        });

        it('should have zero errors in the UI', () => {
          expect($('#address-label-error').length).toBe(0);
        });
      });

      describe('Label with more than 30 characters', () => {
        beforeAll(async () => {
          await editLastAddress({
            ...defaultFormFields,
            'address-label': 'This is a very long address label',
          });
        });

        it('should be unsuccessful', () => {
          expect(response.request.href).toContain(`${appUrl}/edit-delivery-address`);
        });

        it('should display an error message', () => {
          expect($('#address-label-error').length).toBe(1);
        });
      });
    });

    afterAll(async () => {
      await deleteLastAddress();
    });
  });
});
