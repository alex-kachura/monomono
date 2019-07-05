import { extractStateAndHiddenCsfr, getResponse } from '@oneaccount/test-common';

export const defaultFormFields = {
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

export const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

export async function deleteAddress(formData, response, appUrl) {
  const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

  return await getResponse(appUrl, {
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
