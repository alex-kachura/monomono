import LoginPage from '../components/pages/LoginPage';
import LandingPage from '../components/pages/LandingPage';
import RegistrationPage from '../components/pages/RegistrationPage';
import AddNewDeliveryAddressPage from '../components/pages/AddNewDeliveryAddressPage';
import { ClientFunction } from 'testcafe';
import config from 'config';

const loginPage = new LoginPage();
const registrationPage = new RegistrationPage();
const landingPage = new LandingPage();
const addAddressPage = new AddNewDeliveryAddressPage();
const addDeliveryAddressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}/add-delivery-address`;
const addressBookAddedUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}?action=added`;

fixture`Address Book - Add Delivery Address Page`.page(loginPage.addressUrl); // eslint-disable-line no-undef

test(`Landing Page Has Correct URL`, async (t) => {
  await registrationPage.registerUser(t);

  let getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(loginPage.addressUrl);

  await landingPage.clickAddNewDeliveryAddress(t);

  getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(addDeliveryAddressUrl);

  await addAddressPage.addNewAddress(t);

  getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(addressBookAddedUrl);
});

test.page(addDeliveryAddressUrl)(`Select Address From Dropdown`, async (t) => {
  await t
    .useRole(loginPage.logIn)
    .expect(landingPage.signOutButton.exists)
    .ok();

  await addAddressPage.selectAddressFromDropdownForPostcode(t);
});

test.page(addDeliveryAddressUrl)(
  `Postcode error should be visible when invalid postcode is submitted`,
  async (t) => {
    await t
      .useRole(loginPage.logIn)
      .expect(landingPage.signOutButton.exists)
      .ok();

    await t
      .click(addAddressPage.submitButton)
      .expect(addAddressPage.postcodeErrorMessage.visible)
      .ok()
      .typeText(addAddressPage.postcodeField, 'EC1R 5AR')
      .expect(addAddressPage.postcodeErrorMessage.exists)
      .notOk({ timeout: 5000 });
  },
);
