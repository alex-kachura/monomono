import { Role, Selector } from 'testcafe';
import config from 'config';

export default class LoginPage {
  constructor() {
    this.addressUrl = `${config.env.baseUrl}${config.env.basePath}${config.env.language}`;
    this.usernameField = Selector('#username'); // eslint-disable-line new-cap
    this.passwordField = Selector('#password'); // eslint-disable-line new-cap
    this.submitButton = Selector('button.ui-component__button'); // eslint-disable-line new-cap
    this.signOutButton = Selector('#sign-out'); // eslint-disable-line new-cap

    // eslint-disable-next-line new-cap
    this.logIn = Role(this.addressUrl, async (t) => {
      const username = `${config.data.accounts.addressBook.username}`;
      const password = `${config.data.accounts.addressBook.password}`;

      await t
        .typeText(this.usernameField, username)
        .typeText(this.passwordField, password)
        .click(this.submitButton);
    });
  }

  async loginUser(t) {
    await t
      .useRole(this.logIn)
      .expect(this.signOutButton.exists)
      .ok();
  }
}
