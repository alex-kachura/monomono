export const defaultFormFields = {
  postcode: 'EC1R 5AR',
  addressid: 'trn:tesco:address:address:uuid:55ac4b99-5259-42d9-a53e-234f52360ee2',
  'address-line1': '85 Clerkenwell Road',
  'address-line2': '',
  'address-line3': '',
  town: 'LONDON',
  day: '01234567891',
  evening: '01234567891',
  mobile: '',
  nickname: 'home',
};

export async function validateField(t, expected, found, message) {
  await t.expect(expected).contains(found, message);
}
