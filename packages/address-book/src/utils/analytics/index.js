// Utility methods for analytics tracking of form field validation errors

// Tracking codes sent to Adobe
const errorCodes = {
  EMPTY: 'empty',
  INVALD: 'invalid',
};

export function getAnalyticsPayload(fields) {
  // The created payload will only apply to invalid fields
  const filteredFields = fields.filter((field) => !field.isValid);

  const payload = filteredFields.reduce((result, current) => {
    result[current.id] = current.value === '' ? errorCodes.EMPTY : errorCodes.INVALD;

    return result;
  }, {});

  return payload;
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
  const [,,appPath,,page] = url.split('/');

  return `${appPath}:${page || 'landing'} ${extra}`.trim();
}
