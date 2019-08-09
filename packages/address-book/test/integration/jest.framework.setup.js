/**
 * This module will run before each test suite
 */
import { register } from '@oneaccount/test-common';
import { jar } from 'request';

jest.setTimeout(30000);

const { region, appConfig } = global.contexts()[0];
const { externalApps } = appConfig[region];

global.jar = jar();

beforeAll(async () => {
  const response = await register(global.User, global.jar, externalApps.register);

  expect(response.statusCode).toBe(200);
});
