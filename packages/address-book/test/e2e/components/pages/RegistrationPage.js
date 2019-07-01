import { ClientFunction, Role, Selector } from 'testcafe';
import config from 'config';
import { getFormData } from '@oneaccount/test-common';

export default class RegistrationPage {
  constructor() {
    this.addressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}`;
    this.registerUrl = `${config.env.baseUrl}${config.env.accountPath}${config.env.language}${
      config.env.registerPath
    }`;
    this.registerPageLink = Selector('.register-cta__link'); // eslint-disable-line new-cap
    this.titleDropdown = Selector('#title', { visibilityCheck: true }); // eslint-disable-line new-cap
    this.usernameField = Selector('#username'); // eslint-disable-line new-cap
    this.passwordField = Selector('#password'); // eslint-disable-line new-cap
    this.firstName = Selector('#first-name'); // eslint-disable-line new-cap
    this.lastName = Selector('#last-name'); // eslint-disable-line new-cap
    this.phoneNumber = Selector('#phone-number'); // eslint-disable-line new-cap
    this.postcode = Selector('#postcode'); // eslint-disable-line new-cap
    this.enterAddressManuallyLink = Selector('.address__enter-manually'); // eslint-disable-line new-cap
    this.addressLine1 = Selector('#address-line1'); // eslint-disable-line new-cap

    this.submitButton = Selector('#register-form > button'); // eslint-disable-line new-cap
    this.clubcardNumber = Selector('.clubcard-number'); // eslint-disable-line new-cap
    this.signOutButton = Selector('a[href*="logout"]'); // eslint-disable-line new-cap

    // eslint-disable-next-line new-cap
    this.registerRole = Role(this.addressUrl, async (t) => {
      const formData = getFormData();
      const titleOptionElement = this.titleDropdown.find('option');
      const titleOption = titleOptionElement.withText(formData.title);

      await t
        .click(this.registerPageLink)
        .typeText(this.usernameField, formData.username)
        .typeText(this.passwordField, formData.password)
        .click(this.titleDropdown)
        .click(titleOption)
        .typeText(this.firstName, formData.firstName)
        .typeText(this.lastName, formData.lastName)
        .typeText(this.phoneNumber, formData.phoneNumber)
        .typeText(this.postcode, formData.postcode)
        .click(this.enterAddressManuallyLink)
        .typeText(this.addressLine1, formData.addressLine1)
        .click(this.submitButton);
    });

    // eslint-disable-next-line new-cap
    this.registerRoleAndGetClubcard = Role(this.addressUrl, async (t) => {
      const formData = getFormData();
      const titleOptionElement = this.titleDropdown.find('option');
      const titleOption = titleOptionElement.withText(formData.title);

      await t
        .click(this.registerPageLink)
        .typeText(this.usernameField, formData.username)
        .typeText(this.passwordField, formData.password)
        .click(this.titleDropdown)
        .click(titleOption)
        .typeText(this.firstName, formData.firstName)
        .typeText(this.lastName, formData.lastName)
        .typeText(this.phoneNumber, formData.phoneNumber)
        .typeText(this.postcode, formData.postcode)
        .click(this.enterAddressManuallyLink)
        .typeText(this.addressLine1, formData.addressLine1)
        .click(this.submitButton);

      const getLocation = ClientFunction(() => document.location.href); // eslint-disable-line new-cap

      await t.expect(getLocation()).contains(`/confirm?success=true`);

      const clubcard = await this.clubcardNumber.textContent;

      t.ctx.clubcard = clubcard;
    });
  }

  async registerUser(t) {
    await t
      .useRole(this.registerRole)
      .expect(this.signOutButton.exists)
      .ok();
  }
}
