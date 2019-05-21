// import config from 'config';
import { getFormData } from '@oneaccount/test-common';

export const formData = getFormData();

export function formatDateToday(locale = 'en-GB') {
  const date = new Date();
  const month = date.toLocaleString(locale, {
    month: 'long',
  });

  // date is formatted e.g. 6 November, 2020 - European date format used by most
  // countries excluding US, Philippines, Palau, the Federated States of
  // Micronesia, Canada and Belize
  return `${date.getDate()} ${month}, ${date.getFullYear()}`;
}

export function getAccessToken(cookieJar, context) {
  const cookie = cookieJar
    .getCookies(context.appConfig[context.region].externalApps.login)
    .filter((cook) => `${cook}`.includes('OAuth.AccessToken'))[0];

  return `${cookie}`.split('=')[1].split(';')[0];
}
