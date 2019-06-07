import path from 'path';
import config from 'config';
import devices from 'puppeteer/DeviceDescriptors';

const app = config.get('app');
const locale = app.locales[0];
const language = locale.languages[0];
const region = locale.region;
const regional = app[region];

export { toMatchImageSnapshot } from 'jest-image-snapshot';
export const devicesToEmulate = ['iPhone X'];
export const baseURL = `${app.protocol}${locale.hostname}/${app.basePath}/${
  app.appPath
}/${language}`;

const HEADLESS = process.env.HEADLESS !== 'false';
const IS_MOBILE = process.env.IS_MOBILE === 'true';
const INLINE_MODE = process.env.INLINE_MODE === 'true';

export const browserConfig = {
  ignoreHTTPSErrors: true,
  timeout: 360000,
  headless: HEADLESS,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--force-device-scale-factor',
    '--ignore-certificate-errors',
  ],
};

export function setConfig(filename) {
  let deviceName = devicesToEmulate[0];

  deviceName = deviceName.replace(' ', '-').toLowerCase();

  let screenshotsPath = IS_MOBILE ? deviceName : 'desktop';

  screenshotsPath += INLINE_MODE ? '-inline' : '';

  return {
    failureThreshold: '0.015',
    failureThresholdType: 'percent',
    customSnapshotsDir: path.resolve(__dirname, '../__snapshots__/', screenshotsPath),
    customSnapshotIdentifier: filename,
    noColors: true,
  };
}

export async function openURL(page, endpoint) {
  // set url inline mode if INLINE_MODE variable is set to true, default is false
  const url = INLINE_MODE ? `${endpoint}?consumer=true` : endpoint;

  await page.goto(url, {
    timeout: 30000,
    waitUntil: ['load', 'networkidle2'],
  });

  // emulate on default mobile device after opening the page
  if (IS_MOBILE) {
    const emulateOptions = {
      ...devices[devicesToEmulate[0]],
    };

    // Reduce scale factor for smaller screenshots (quicker to compare)
    emulateOptions.viewport.deviceScaleFactor = 1;
    await page.emulate(emulateOptions);
  } else {
    await page.setViewport({
      width: 1280,
      height: 1400,
    });
  }
}

export async function generateAndCompare(page, filename) {
  const image = await page.screenshot({
    fullPage: true,
  });
  let deviceName = devicesToEmulate[0];

  deviceName = deviceName.replace(' ', '-').toLowerCase();

  let name = `${filename}-${IS_MOBILE ? deviceName : 'desktop'}`;

  name += INLINE_MODE ? '-inline' : '';

  expect(image).toMatchImageSnapshot(setConfig(name));
}

export async function login(page, username, password) {
  await openURL(page, regional.externalApps.login, {
    waitUntil: ['load', 'networkidle2'],
  });
  await page.type('#username', username, { delay: 5 });
  await page.type('#password', password, { delay: 2 });
  await page.click('button.ui-component__button');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
}
