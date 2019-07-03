import LoginPage from '../components/pages/LoginPage';
import LandingPage from '../components/pages/LandingPage';
import RegistrationPage from '../components/pages/RegistrationPage';
import AddNewDeliveryAddressPage from '../components/pages/AddNewDeliveryAddressPage';
import { defaultFormFields, validateField } from '../components/data.js';

const loginPage = new LoginPage();
const registrationPage = new RegistrationPage();
const landingPage = new LandingPage();
const addAddressPage = new AddNewDeliveryAddressPage();

fixture`Address Book - Landing Page`.page(loginPage.addressUrl); // eslint-disable-line no-undef

test(`Add/Delete first added address`, async (t) => {
  await registrationPage.registerUser(t);

  await landingPage.clickAddNewDeliveryAddress(t);

  await addAddressPage.addNewAddress(t);

  const addedAddress = await landingPage.getFirstAddress();

  await validateField(
    t,
    addedAddress.nickname,
    defaultFormFields.nickname,
    'Check nickname is correct',
  );
  await validateField(t, addedAddress.town, defaultFormFields.town, 'Check town is correct');
  await validateField(t, addedAddress.day, defaultFormFields.day, 'Check day number is correct');
  await validateField(
    t,
    addedAddress.evening,
    defaultFormFields.evening,
    'Check evening number is correct',
  );

  let addresses = await landingPage.getNumberOfAddresses();

  await t.expect(addresses).eql(1, 'First address should be added correctly');

  await landingPage.cancelDeleteFirstAddress(t);

  await landingPage.deleteFirstAddress(t);

  addresses = await landingPage.getNumberOfAddresses();

  await t.expect(addresses).eql(0, 'First address should be deleted correctly');
});
