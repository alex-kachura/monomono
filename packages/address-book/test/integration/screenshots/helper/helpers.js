import path from 'path';
import config from 'config';
import devices from 'puppeteer/DeviceDescriptors';
export { toMatchImageSnapshot } from 'jest-image-snapshot';
export const devicesToEmulate = ['iPhone X'];
export const baseURL = `${config.app.baseUrl}${config.env.basePath}${config.env.language}`;
const HEADLESS = process.env.HEADLESS !== 'false';
const IS_MOBILE = process.env.IS_MOBILE !== 'false';
const INLINE_MODE = process.env.INLINE_MODE !== 'false';

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
    // await page.emulate(devices[devicesToEmulate[0]]);

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
  const imageMobile = await page.screenshot({
    fullPage: true,
  });
  let deviceName = devicesToEmulate[0];

  deviceName = deviceName.replace(' ', '-').toLowerCase();

  let name = `${filename}-${IS_MOBILE ? deviceName : 'desktop'}`;

  name += INLINE_MODE ? '-inline' : '';

  expect(imageMobile).toMatchImageSnapshot(setConfig(name));
}
