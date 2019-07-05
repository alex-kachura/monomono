import cheerio from 'cheerio';
import { getResponse, extractStateAndHiddenCsfr } from '@oneaccount/test-common';
import { defaultFormFields, headers, deleteAddress } from './helpers';

const jar = global.jar;

let response;
let $;

describe.each(contexts())('Address Page', (context) => {
  const { region, appUrl } = context;

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

  async function getLastAddressId() {
    await loadPage(appUrl);

    return getHiddenInputs()
      .last()
      .attr('value');
  }

  async function deleteLastAddress() {
    const contactAddressId = await getLastAddressId();

    response = await deleteAddress({ 'contact-address-id': contactAddressId }, response, appUrl);

    expect(response.statusCode).toBe(200);
  }

  describe(region, () => {
    beforeAll(async () => {
      await addDeliveryAddress();
    });

    describe('Delete last added address', () => {
      it('should delete last added delivery address', async () => {
        let contactAddressId = await getLastAddressId();

        expect(contactAddressId).toBeDefined();

        await deleteLastAddress();

        contactAddressId = await getLastAddressId();

        expect(contactAddressId).toBeUndefined();
      });
    });
  });
});
