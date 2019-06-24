import { Selector } from 'testcafe';

export default class LandingPage {
  constructor() {
    this.signOutButton = Selector('#sign-out'); // eslint-disable-line new-cap
    this.editPrimaryClubAddress = Selector('#edit-address-clubcard .edit-address-link-clubcard'); // eslint-disable-line new-cap
    this.editPrimaryDeliveryAddress = Selector('#edit-address-grocery .edit-address-link-grocery'); // eslint-disable-line new-cap
    this.addDeliveryAddressButton = Selector('#add-delivery-address'); // eslint-disable-line new-cap
    this.deleteButtons = Selector('.other-address > div .delete-address'); // eslint-disable-line new-cap
    this.deleteButtonsConfirm = Selector('.other-address > div .delete-address-confirm'); // eslint-disable-line new-cap
    this.otherAddresses = Selector('.other-address > div h4.addressLabel'); // eslint-disable-line new-cap
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
}
