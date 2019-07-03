import { Selector } from 'testcafe';

export default class LandingPage {
  constructor() {
    this.signOutButton = Selector('a[href*="logout"]'); // eslint-disable-line new-cap
    this.editPrimaryClubAddress = Selector('#edit-address-clubcard .edit-address-link-clubcard'); // eslint-disable-line new-cap
    this.editPrimaryDeliveryAddress = Selector('#edit-address-grocery .edit-address-link-grocery'); // eslint-disable-line new-cap
    this.addDeliveryAddressButton = Selector('#add-delivery-address'); // eslint-disable-line new-cap
    this.deleteButtons = Selector('.other-address > div .delete-address'); // eslint-disable-line new-cap
    this.deleteButtonsConfirm = Selector('.other-address > div .delete-address-confirm'); // eslint-disable-line new-cap
    this.deleteButtonsCancel = Selector('.other-address > div .delete-address-cancel'); // eslint-disable-line new-cap
    this.otherAddresses = Selector('.other-address > div h4.addressLabel'); // eslint-disable-line new-cap
    this.otherAddressesNickname = Selector('.other-address > div h4.nickname'); // eslint-disable-line new-cap
    this.otherAddressesAddressLine0 = Selector('.other-address > div p.address-line-0'); // eslint-disable-line new-cap
    this.otherAddressesTown = Selector('.other-address > div p.town'); // eslint-disable-line new-cap
    this.otherAddressesDayNumber = Selector('.other-address > div p.telephone-number-0'); // eslint-disable-line new-cap
    this.otherAddressesEveningNumber = Selector('.other-address > div p.telephone-number-1'); // eslint-disable-line new-cap
    this.otherAddressesMobileNumber = Selector('.other-address > div p.telephone-number-2'); // eslint-disable-line new-cap
  }

  async clickAddNewDeliveryAddress(t) {
    await t.click(this.addDeliveryAddressButton);
  }
  async clickEditClubcardAddress(t) {
    await t.click(this.editPrimaryClubAddress);
  }

  async clickEditDeliveryAddress(t) {
    await t.click(this.editPrimaryDeliveryAddress);
  }

  async deleteAllOtherAddresses(t) {
    const deleteButtonsCounts = await this.deleteButtons.count;

    for (let i = 0; i < deleteButtonsCounts; i++) {
      const deleteButtonElement = await this.deleteButtons.nth(0)();

      await t.click(deleteButtonElement);

      const deleteButtonConfirmElement = await this.deleteButtonsConfirm.nth(0)();

      await t.click(deleteButtonConfirmElement);
    }
  }

  async getNumberOfAddresses() {
    const addressCount = await this.otherAddressesNickname.count;

    return addressCount;
  }

  async deleteFirstAddress(t) {
    const deleteButtonElement = await this.deleteButtons.nth(0)();

    await t.click(deleteButtonElement);

    const deleteButtonConfirmElement = await this.deleteButtonsConfirm.nth(0)();

    await t.click(deleteButtonConfirmElement);
  }

  async cancelDeleteFirstAddress(t) {
    const deleteButtonElement = await this.deleteButtons.nth(0)();

    await t.click(deleteButtonElement);

    const deleteButtonCancelElement = await this.deleteButtonsCancel.nth(0)();

    await t.click(deleteButtonCancelElement);
  }

  async getOtherAddressesFirstNickname() {
    const firstNickNameElement = await this.otherAddressesNickname.nth(0)();

    return firstNickNameElement.innerText;
  }

  async getFirstAddress() {
    const address = {
      nickname: await this.otherAddressesNickname.nth(0)().innerText,
      'address-line1': await this.otherAddressesAddressLine0.nth(0)().innerText,
      town: await this.otherAddressesTown.nth(0)().innerText,
      day: await this.otherAddressesDayNumber.nth(0)().innerText,
      evening: await this.otherAddressesEveningNumber.nth(0)().innerText,
    };

    return address;
  }
}
