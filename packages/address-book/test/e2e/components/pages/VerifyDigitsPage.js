import { Selector } from 'testcafe';

export default class VerifyDigitsPage {
  constructor() {
    this.submitButton = Selector('button[type="submit"]'); // eslint-disable-line new-cap
  }

  async submitDigits(t) {
    await t.click(this.submitButton);
  }
}
