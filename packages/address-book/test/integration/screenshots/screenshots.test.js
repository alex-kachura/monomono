import {
  browserConfig,
  baseURL,
  login,
  openURL,
  generateAndCompare,
  toMatchImageSnapshot,
} from './helpers';

const puppeteer = require('puppeteer');

let browser;
let page;
let filenamePrefix;

describe('screenshots', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch(browserConfig);
    page = await browser.newPage();
    expect.extend({ toMatchImageSnapshot });
    await login(page, global.User.username, global.User.password);
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await generateAndCompare(page, filenamePrefix);
  });

  it('landing page initial', async () => {
    filenamePrefix = 'landing-page-initial';
    await openURL(page, baseURL);
  });
});
