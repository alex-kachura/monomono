import { Selector } from 'testcafe';

export default class EditClubcardAddressPage {
  constructor() {
    this.postcodeField = Selector('#postcode'); // eslint-disable-line new-cap
    this.findAddressButton = Selector('.find-address'); // eslint-disable-line new-cap
    this.manualAddressLink = Selector('.manual-link'); // eslint-disable-line new-cap
    this.postcodeErrorMessage = Selector('#postcode-error'); // eslint-disable-line new-cap
    this.addressLine1 = Selector('#address-line1'); // eslint-disable-line new-cap
    this.addressLine2 = Selector('#address-line1'); // eslint-disable-line new-cap
    this.addressLine3 = Selector('#address-line3'); // eslint-disable-line new-cap
    this.town = Selector('#town'); // eslint-disable-line new-cap
    this.dayNumber = Selector('#day-number'); // eslint-disable-line new-cap
    this.eveningNumber = Selector('#evening-number'); // eslint-disable-line new-cap
    this.mobileNumber = Selector('#mobile-number'); // eslint-disable-line new-cap
    this.nickname = Selector('#address-label'); // eslint-disable-line new-cap
    this.submitButton = Selector('button[type="submit"]'); // eslint-disable-line new-cap
  }

  async editAddressLine1(t, randomNumber) {
    await t.typeText(this.addressLine1, randomNumber, { replace: true }).click(this.submitButton);
  }
}
