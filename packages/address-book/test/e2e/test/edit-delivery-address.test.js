import LoginPage from '../components/pages/LoginPage';
import LandingPage from '../components/pages/LandingPage';
import EditDeliveryAddressPage from '../components/pages/EditDeliveryAddressPage';
import { ClientFunction, Selector } from 'testcafe';
import config from 'config';
import RegistrationPage from '../components/pages/RegistrationPage';

const landingPage = new LandingPage();
const loginPage = new LoginPage();
const editAddressPage = new EditDeliveryAddressPage();
const registrationPage = new RegistrationPage();
const editDeliveryAddressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}/edit-delivery-address`;
const editDeliveryAddressUpdatedUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}?action=updated`;

fixture`Edit Delivery Address` // eslint-disable-line no-undef
  .page(loginPage.addressUrl)
  .beforeEach(async (t) => {
    await registrationPage.registerUser(t);
  });

test(`Address Book - Edit Primary Delivery Address Line 1`, async (t) => {
  await landingPage.clickEditDeliveryAddress(t);

  let getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(editDeliveryAddressUrl);

  const addressLine0 = `Address Line ${Math.floor(Math.random() * 1000) + 1}`;

  await editAddressPage.editAddressLine1(t, addressLine0);

  getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(editDeliveryAddressUpdatedUrl);

  const primaryAddressLine0 = Selector('#edit-address-grocery .address-line-0'); // eslint-disable-line new-cap

  await t
    .expect(primaryAddressLine0.innerText)
    .eql(addressLine0, 'Edit address line 0 was updated correctly');
});
