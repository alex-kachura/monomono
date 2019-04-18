import {
  browserConfig,
  baseURL,
  openURL,
  generateAndCompare,
  toMatchImageSnapshot,
} from './helper/helpers';

const puppeteer = require('puppeteer');

jest.setTimeout(30000);

let browser;
let page;
let filenamePrefix;

describe('screenshots', () => {
  it('landing page auth', async () => {
    filenamePrefix = 'landing-page-auth';

    await openURL(page, baseURL);
  });
});

// Setup and Tear Down helper methods
beforeAll(async () => {
  browser = await puppeteer.launch(browserConfig);
  page = await browser.newPage();
  expect.extend({ toMatchImageSnapshot });
});

afterEach(async () => {
  await generateAndCompare(page, filenamePrefix);
});

afterAll(async () => {
  await browser.close();
});
