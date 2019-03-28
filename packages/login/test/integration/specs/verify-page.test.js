import { jar } from 'request';
import { getResponse, login } from '@oneaccount/test-common';

jest.setTimeout(30000);

describe.each(contexts())('Verify Page (/verify)', (context) => {
  const headers = { 'Content-Type': 'text/html', Accept: 'text/html' };

  let cookieJar;
  let response;

  const { region, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];

  describe('should redirect to login when unauthenticated', () => {
    beforeAll(async () => {
      cookieJar = jar();
      response = await getResponse(`${appUrl}/verify`, {
        jar: cookieJar,
        headers,
      });
    });

    it('has a status code of 200', () => {
      expect(response.statusCode).toBe(200);
    });

    it('login page has loaded', () => {
      expect(response.request.href).toContain(externalApps.login);
    });
  });

  describe('should render page when authenticated', () => {
    beforeAll(async () => {
      cookieJar = jar();

      await login(
        context.accounts.default.username,
        context.accounts.default.password,
        cookieJar,
        externalApps.login,
        {
          headers,
        },
      );

      response = await getResponse(`${appUrl}/verify`, {
        jar: cookieJar,
        headers,
      });
    });

    it('has a status code of 200', () => {
      expect(response.statusCode).toBe(200);
    });

    it('has loaded', () => {
      expect(response.request.href).toBe(`${appUrl}/verify`);
    });
  });
});
