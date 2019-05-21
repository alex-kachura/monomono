import config from 'config';
import { jar } from 'request';
import cheerio from 'cheerio';
import {
  getFormData,
  getResponse,
  login,
  register,
  getClubcard,
  extractStateAndHiddenCsfr,
} from '@oneaccount/test-common';
import { getAccessToken } from './helpers';

jest.setTimeout(30000);

describe.each(contexts())('Verify Page (/verify)', (context) => {
  const headers = { 'Content-Type': 'text/html', Accept: 'text/html' };
  const { region, appUrl, appConfig } = context;
  const { externalApps } = appConfig[region];
  let $;
  let cookieJar;
  let clubcardNumber;

  async function submitForm(response, digits) {
    const { state, hiddenCsrf } = extractStateAndHiddenCsfr(response.body);

    return getResponse(`${appUrl}/verify`, {
      method: 'POST',
      jar: cookieJar,
      followAllRedirects: true,
      form: {
        ...digits,
        state,
        '_csrf': hiddenCsrf,
      },
      headers: {
        Accept: 'text/html',
      },
    });
  }

  describe('unauthenticated', () => {
    let response;

    beforeAll(async () => {
      cookieJar = jar();
      response = await getResponse(`${appUrl}/verify`, {
        jar: cookieJar,
        headers,
      });
    });

    it('should redirect to login', () => {
      expect(response.request.href).toContain(externalApps.login);
    });

    it('should have a status code of 200', () => {
      expect(response.statusCode).toBe(200);
    });
  });

  describe('authenticated', () => {
    let formData;

    async function createUserAndLogin() {
      cookieJar = jar();
      formData = getFormData();

      await register(formData, cookieJar, externalApps.register);

      clubcardNumber = await getClubcard(
        getAccessToken(cookieJar, context),
        config.get('app.services.fullyQualifiedClientId')
      );

      await getResponse(externalApps.logout, {
        jar: cookieJar,
        headers,
      });

      await login(
        formData.username,
        formData.password,
        cookieJar,
        externalApps.login,
        {
          headers,
        },
      );
    }

    function getDigitPositions(response) {
      const positions = [];

      $ = cheerio.load(response.body);

      // Get clubcard digit positions from rendered labels
      $('[name="clubcard-form-group"] label').each((i, element) => {
        const labelText = $(element).text();

        positions.push(labelText.substring(0, labelText.indexOf('th')));
      });

      return positions;
    }

    beforeAll(async () => {
      await createUserAndLogin();
    });

    describe('on rendering page', () => {
      let response;

      beforeAll(async () => {
        response = await getResponse(`${appUrl}/verify`, {
          jar: cookieJar,
          headers,
        });
      });

      it('should have correct url', () => {
        expect(response.request.href).toBe(`${appUrl}/verify`);
      });

      it('should have a status code of 200', () => {
        expect(response.statusCode).toBe(200);
      });
    });

    describe('on submitting incorrect digits', () => {
      let response;

      beforeAll(async () => {
        response = await getResponse(`${appUrl}/verify`, {
          jar: cookieJar,
          headers,
        });

        response = await submitForm(response, {
          digit11: '',
          digit12: '',
          digit13: '',
        });
      });

      it('should reload the page', () => {
        expect(response.request.href).toBe(`${appUrl}/verify`);
      });

      it('should have a status code of 400', () => {
        expect(response.statusCode).toBe(400);
      });
    });

    describe('on submitting correct digits', () => {
      describe('without from query parameter', () => {
        let response;
        let digitPositions = [];

        beforeAll(async () => {
          response = await getResponse(`${appUrl}/verify`, {
            jar: cookieJar,
            headers,
          });

          digitPositions = getDigitPositions(response);

          response = await submitForm(response, {
            [`digit${digitPositions[0]}`]: clubcardNumber[digitPositions[0]-1],
            [`digit${digitPositions[1]}`]: clubcardNumber[digitPositions[1]-1],
            [`digit${digitPositions[2]}`]: clubcardNumber[digitPositions[2]-1],
          });
        });

        it('should redirect to tesco homepage', () => {
          expect(response.request.href).toBe('https://www.tesco.com/');
        });
      });

      describe('with from query parameter', () => {
        let response;
        let digitPositions = [];

        beforeAll(async () => {
          response = await getResponse(externalApps.logout, {
            jar: cookieJar,
            followRedirect: true,
          });

          await login(
            formData.username,
            formData.password,
            cookieJar,
            externalApps.login,
            {
              headers,
            },
          );

          response = await getResponse(`${appUrl}/verify?from=${externalApps.myaccount}`, {
            jar: cookieJar,
            headers,
          });

          digitPositions = getDigitPositions(response);

          response = await submitForm(response, {
            [`digit${digitPositions[0]}`]: clubcardNumber[digitPositions[0]-1],
            [`digit${digitPositions[1]}`]: clubcardNumber[digitPositions[1]-1],
            [`digit${digitPositions[2]}`]: clubcardNumber[digitPositions[2]-1],
          });
        });

        it('should redirect to from url', () => {
          expect(response.request.href).toBe(externalApps.myaccount);
        });
      });
    });
  });
});
