import { jar } from 'request';
import { getResponse } from '@oneaccount/test-common';

describe.each(contexts())('Status Page (/_status)', (context) => {
  const { region, baseUrl } = context;

  const headers = {
    'Content-Type': 'text/html',
    Accept: 'text/html',
  };

  let response;

  describe(region, () => {
    describe('should render status page', () => {
      beforeAll(async () => {
        response = await getResponse(`${baseUrl}/_status`, { jar, headers });
      });

      it('has a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });

      it('has correct content', () => {
        expect(response.body).toBe('OK');
      });
    });
  });
});
