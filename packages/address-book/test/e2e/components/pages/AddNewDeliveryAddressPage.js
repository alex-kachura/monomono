import { ClientFunction, Selector } from 'testcafe';
import config from 'config';
import { defaultFormFields } from '../data.js';

const getPageUrl = ClientFunction(() => window.location.href.toString()); // eslint-disable-line new-cap
const addressBookAddedUrl = `${config.env.baseUrl}${config.env.basePath}${
  config.env.language
}?action=added`;

export default class AddNewDeliveryAddressPage {
  constructor() {
    this.postcodeField = Selector('#postcode'); // eslint-disable-line new-cap
    this.findAddressButton = Selector('.find-address'); // eslint-disable-line new-cap
    this.addressDropdown = Selector('.address-dropdown select', { visibilityCheck: true }); // eslint-disable-line new-cap
    this.manualAddressLink = Selector('.manual-link'); // eslint-disable-line new-cap
    this.postcodeErrorMessage = Selector('#postcode-error'); // eslint-disable-line new-cap
    this.addressLine1 = Selector('#address-line1'); // eslint-disable-line new-cap
    this.addressLine2 = Selector('#address-line1'); // eslint-disable-line new-cap
    this.addressLine3 = Selector('#address-line3'); // eslint-disable-line new-cap
    this.town = Selector('#town'); // eslint-disable-line new-cap
    this.dayNumber = Selector('#day-number'); // eslint-disable-line new-cap
    this.dayNumberErrorMessage = Selector('#day-number-error'); // eslint-disable-line new-cap
    this.eveningNumber = Selector('#evening-number'); // eslint-disable-line new-cap
    this.eveningNumberErrorMessage = Selector('#evening-number-error'); // eslint-disable-line new-cap
    this.mobileNumber = Selector('#mobile-number'); // eslint-disable-line new-cap
    this.addressLabel = Selector('#address-label'); // eslint-disable-line new-cap
    this.addressLabelErrorMessage = Selector('#address-label-error'); // eslint-disable-line new-cap
    this.submitButton = Selector('button[type="submit"]'); // eslint-disable-line new-cap
  }

  async addNewAddress(t) {
    await t
      .typeText(this.postcodeField, defaultFormFields.postcode)
      .click(this.manualAddressLink)
      .typeText(this.addressLine1, defaultFormFields['address-line1'])
      .typeText(this.town, defaultFormFields.town)
      .typeText(this.dayNumber, defaultFormFields.day)
      .typeText(this.eveningNumber, defaultFormFields.evening)
      .typeText(this.addressLabel, defaultFormFields.nickname)
      .click(this.submitButton)
      .expect(getPageUrl())
      .contains(addressBookAddedUrl, { timeout: 10000 });
  }

  async selectAddressFromDropdownForPostcode(t) {
    await t
      .typeText(this.postcodeField, defaultFormFields.postcode)
      .click(this.findAddressButton)
      .click(this.addressDropdown);

    const addressOption = this.addressDropdown.find('option');
    const item = addressOption.withText(defaultFormFields['address-line1']);

    await t
      .click(item)
      .expect(this.addressLine1.value)
      .eql(defaultFormFields['address-line1']);
  }
}
