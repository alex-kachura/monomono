// Utility methods for analytics tracking of form field validation errors

export const PAYLOAD_TYPES = {
  VALIDATION_ERRORS: 'validation_errors',
  PAGE_NAME: 'page_name',
};

export const Analytics = {
  Verify: {
    Events: {
      ORDER_NEW_CC: 'order a new one',
      PHONE_NUMBER1: 'phone number 1',
      PHONE_NUMBER2: 'phone number 2',
    },
    DirectCallRules: {
      VALIDATION_ERRORS: 'validation-errors',
    },
  },
};

// Tracking codes sent to Adobe
const ErrorCodes = {
  required: 'empty',
  type: 'invalid',
  pattern: 'invalid',
  maxLength: 'maxlength',
};

export function errorsToPayload(errors, fields = []) {
  return Object.keys(errors).reduce((result, property) => {
    const { id } = fields.find(({ name }) => name === property) || {};

    result[id || property] = errors[property].map(({ keyword }) => ErrorCodes[keyword])[0];

    return result;
  }, {});
}

export function clearAnalyticsPayload(prop) {
  if (window.dataLayer && window.dataLayer[prop]) {
    window.dataLayer[prop] = {}; // eslint-disable-line camelcase
  }
}

export function updateDataLayer(prop, payload) {
  const { dataLayer } = window;

  if (!dataLayer) {
    return;
  }

  // Add payload to dataLayer which Adobve scripts reads from
  dataLayer[prop] = payload;
}

export function trackEvent(event, prop, payload) {
  // Do not proceed without Adobve Analytics tools needed for tracking..
  // eslint-disable-next-line no-underscore-dangle
  if (!window._satellite || !window._satellite.track) {
    return;
  }

  clearAnalyticsPayload(PAYLOAD_TYPES.VALIDATION_ERRORS);

  // Add validation errors to object expected by Adobe Analytics, if any
  if (prop && payload) {
    updateDataLayer(prop, payload);
  }

  // Trigger tracking call
  window._satellite.track(event); // eslint-disable-line no-underscore-dangle
}

// Get the page name used by Adobe Analytics to track page visits.
// Derived from URL structure: /<basePath>/<appPath>/<locale>/<page>
export function getPageName(url, extra = '') {
  const [, , appPath, , page] = url.split('/');

  return `${appPath}:${page || 'landing'} ${extra}`.trim();
}
