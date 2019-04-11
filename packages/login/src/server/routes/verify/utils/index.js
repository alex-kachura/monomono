import AJV from 'ajv';
import ajvErrors from 'ajv-errors';
import { getPhraseFactory } from '../../../utils/i18n';
import { setCookies } from '../../../utils/cookies';

export const ajv = ajvErrors(
  new AJV({
    allErrors: true,
    jsonPointers: true,
    $data: true,
    coerceTypes: true,
  }),
  {
    allErrors: true,
  }
);

function getField(field, getLocalePhrase, isMobile) {
  // Identity returns the id as 'digitNN', e.g. 'digit11'
  // So we need to extract the number for our label :-(
  const digit = field.id.split('digit')[1];

  return {
    type: isMobile ? 'number' : 'text',
    name: field.id,
    id: field.id,
    label: `${digit}${getLocalePhrase('pages.verify.digits-ordinal')}`,
  };
}

// Map fields returned by Identity (payload) to UI fields
// that will be used to render on the client-side
export function mapPayloadToFields(payload, lang, isMobile) {
  const getLocalePhrase = getPhraseFactory(lang);

  return payload.map((digit) => getField(digit, getLocalePhrase, isMobile));
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
export function setAuthCookies(req, res, { accessToken, refreshToken, claims, expires }) {
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
}
