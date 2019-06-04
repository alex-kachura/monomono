import { getLocalePhrase } from './i18n';

export const send = jest.fn();
export const lang = 'en-GB';
export const region = 'GB';
export const accessToken = 'mock-access-token';
export const getClaims = jest.fn(() => ({ accessToken }));
export const sessionId = 'mock-tracer';
export const next = jest.fn();
export const redirect = jest.fn();
export const requestFactory = (extra = {}) => ({
  sessionId,
  getLocalePhrase,
  getClaims,
  lang,
  region,
  ...extra,
});

export const responseFactory = ({ responseType = 'html', ...extra } = {}) => ({
  redirect,
  format: (formats) => formats[responseType](),
  send,
  data: {},
  ...extra,
});
