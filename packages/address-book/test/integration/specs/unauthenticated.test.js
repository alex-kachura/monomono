import { jar } from 'request';
import { getResponse } from '@oneaccount/test-common';

const headers = {
  'Content-Type': 'text/html',
  Accept: 'text/html',
};

let response;

describe.each(contexts())('Unauthenticated', (context) => {
  const { region, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];

  describe(region, () => {
    it('should redirect to login page', async () => {
      response = await getResponse(appUrl, { jar: jar(), headers });

      expect(response.statusCode).toBe(200);
      expect(response.request.href).toContain(externalApps.login);
    });
  });
});
