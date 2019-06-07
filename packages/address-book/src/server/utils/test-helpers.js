import { getLocalePhrase } from './i18n';

export const send = jest.fn();
export const lang = 'en-GB';
export const region = 'GB';
export const accessToken = 'mock-access-token';
export const getClaims = jest.fn(() => ({ accessToken }));
export const sessionId = 'mock-tracer';
export const hostname = 'mock-host';
export const next = jest.fn();
export const redirect = jest.fn();
export const end = jest.fn();
export const status = jest.fn(() => ({ end }));
export const baseUrl = '/base-url';
export const url = '/url?param1=val&parm2=val';
export const location = jest.fn();
export const requestFactory = (extra = {}) => ({
  baseUrl,
  url,
  sessionId,
  getLocalePhrase,
  getClaims,
  lang,
  region,
  hostname,
  ...extra,
});

export const responseFactory = ({ responseType = 'html', ...extra } = {}) => ({
  redirect,
  format: (formats) => formats[responseType](),
  send,
  data: {},
  status,
  location,
  ...extra,
});
