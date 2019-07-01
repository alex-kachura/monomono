import LoginPage from '../components/pages/LoginPage';
import LandingPage from '../components/pages/LandingPage';
import VerifyDigitsPage from '../components/pages/VerifyDigitsPage';
import EditClubcardAddressPage from '../components/pages/EditClubcardAddressPage';
import { ClientFunction, Selector } from 'testcafe';
import config from 'config';

const loginPage = new LoginPage();
const landingPage = new LandingPage();
const verifyDigitsPage = new VerifyDigitsPage();
const editClubcardAddressPage = new EditClubcardAddressPage();
const verifyDigitsClubcardUrl = `${config.env.baseUrl}${config.env.loginPath}${config.env.language}${config.env.verifyPath}`;
const editClubcardAddressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}/edit-clubcard-address`;
const editedClubcardAddressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}?action=clubcard-updated`;

fixture`Edit Clubcard Address` // eslint-disable-line no-undef
  .page(loginPage.addressUrl)
  .beforeEach(async (t) => {
    await loginPage.loginUser(t);
  });

test(`Address Book - Verify Digits Success`, async (t) => {
  await landingPage.clickEditClubcardAddress(t);

  let getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(verifyDigitsClubcardUrl);

  const inputs = Selector('[name="clubcard-form-group"] label'); // eslint-disable-line new-cap
  const counts = await inputs.count;
  const digitPositions = [];
  const clubcardNumber = `${config.data.accounts.addressBook.clubcard}`;

  for (let i = 0; i < counts; i++) {
    const element = inputs.nth(i);
    const snapshot = await element();
    const labelText = snapshot.innerText;

    digitPositions.push(labelText.substring(0, labelText.indexOf('th')));

    const currentDigit = clubcardNumber[digitPositions[i] - 1];

    await t.pressKey(currentDigit);
  }

  await verifyDigitsPage.submitDigits(t);

  getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap
  await t.expect(getLocation()).contains(editClubcardAddressUrl);
});

test(`Address Book - Edit Clubcard Address`, async (t) => {
  await landingPage.clickEditClubcardAddress(t);

  const inputs = Selector('[name="clubcard-form-group"] label'); // eslint-disable-line new-cap
  const counts = await inputs.count;
  const digitPositions = [];
  const clubcardNumber = `${config.data.accounts.addressBook.clubcard}`;

  for (let i = 0; i < counts; i++) {
    const element = inputs.nth(i);
    const snapshot = await element();
    const labelText = snapshot.innerText;

    digitPositions.push(labelText.substring(0, labelText.indexOf('th')));

    const currentDigit = clubcardNumber[digitPositions[i] - 1];

    await t.pressKey(currentDigit);
  }

  await verifyDigitsPage.submitDigits(t);

  let getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(editClubcardAddressUrl);

  const addressLine0 = `Address Line ${Math.floor(Math.random() * 1000) + 1}`;

  await editClubcardAddressPage.editAddressLine1(t, addressLine0);

  getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

  await t.expect(getLocation()).contains(editedClubcardAddressUrl);

  const primaryClubcardAddressLine0 = Selector('#edit-address-clubcard .address-line-0'); // eslint-disable-line new-cap

  await t
    .expect(primaryClubcardAddressLine0.innerText)
    .eql(addressLine0, 'Edit address line 0 was updated correctly');
});
