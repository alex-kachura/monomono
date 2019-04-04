import config from 'config';
import { getPhraseFactory } from '../../../utils/i18n';
import { setCookies } from '../../../utils/cookies';

function getField(field, getLocalePhrase) {
  // Identity returns the id as 'digitNN', e.g. 'digit11'
  // So we need to extract the number for our label :-(
  const digit = field.id.split('digit')[1];

  return {
    name: field.id,
    id: field.id,
    label: `${digit}${getLocalePhrase('pages.verify.digits-ordinal')}`,
    isValid: true,
    value: '',
    type: 'input',
    constraints: [
      {
        type: 'mandatory',
        text: getLocalePhrase('pages.verify.fields.digit.empty'),
        validator: true,
        isValid: true,
      },
      {
        type: 'regex',
        text: getLocalePhrase('pages.verify.fields.digit.errors.max-length'),
        validationRegex: '^.{1,1}$',
        isValid: true,
      },
    ],
  };
}

// Map fields returned by Identity (payload) to UI fields
// that will be used to render on the client-side
export function mapPayloadToFields(payload, lang) {
  const getLocalePhrase = getPhraseFactory(lang);

  return payload.map((digit) => getField(digit, getLocalePhrase));
}

// Map posted values to fields array that is understood by Identity
export function mapValuesToPayload(values) {
  return Object.keys(values)
    .map((key) => ({
      id: key,
      value: values[key],
    }))
    .filter(({ id }) => id !== 'state' && id !== '_csrf');
}

// Redirect a user to the login page after saving cookies
export function sendToLogin(req, res, { accessToken, refreshToken, claims, expires }) {
  const uuid = claims.find(
    (c) => c.claimType === 'http://schemas.tesco.com/ws/2011/12/identity/claims/userkey'
  ).value;

  // Set cookies for various tokens returned by Identity
  setCookies(res, {
    accessToken,
    refreshToken,
    oauthTokensExpiryTime: Date.now() + (expires * 1000),
    uuid: decodeURIComponent(uuid),
  });

  const loginUrl = config[req.region].externalApps.login;

  return res.redirect(loginUrl);
}
