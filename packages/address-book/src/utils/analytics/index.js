// Utility methods for analytics tracking of form field validation errors

export const PAYLOAD_TYPES = {
  VALIDATION_ERRORS: 'validation_errors',
  PAGE_NAME: 'page_name',
};

export const Analytics = {
  Location: {
    DirectCallRules: {
      LOCATION_CHANGE: 'addressbook_location_change',
    },
  },
  Address: {
    Events: {
      MANUAL_ADDRESS: 'enter manual address',
    },
    DirectCallRules: {
      ADDRESS_LOOKUP_SUCCESS: 'addressbook_postcode_lookup_success',
      ADDRESS_LOOKUP_FAILURE: 'addressbook_postcode_lookup_error',
      ADDRESS_LOOKUP_SELECTED: 'addressbook_postcode_lookup result selected',
    },
  },
  Landing: {
    Events: {
      ADD_DELIVERY_ADDRESS: 'add delivery address:addressbook',
      DELETE_DELIVERY_ADDRESS: 'delete delivery address:addressbook',
      TOGGLE_DELETE_DELIVERY_ADDRESS: 'delete alternative delivery address:addressbook',
      KEEP_DELIVERY_ADDRESS: 'keep alternative delivery address:addressbook',
      EDIT_DELIVERY_ADDRESS: 'edit delivery address:addressbook',
      EDIT_CLUBCARD_ADDRESS: 'edit clubcard address:addressbook',
      EDIT_GROCERY_ADDRESS: 'edit default grocery shopping address:addressbook',
    },
    DirectCallRules: {},
  },
  EditGroceryAddress: {
    Events: {},
    DirectCallRules: {
      SUCCESS: 'addressbook_changed-default_success',
      VALIDATION_ERRORS: 'addressbook_changed-address_validation_errors',
      FAILURE: 'addressbook_changed-address_failure',
    },
  },
  EditClubcardAddress: {
    Events: {},
    DirectCallRules: {
      SUCCESS: 'addressbook_changed-clubcard_success',
      VALIDATION_ERRORS: 'addressbook_changed-clubcard_validation_errors',
      FAILURE: 'addressbook_changed-clubcard_failure',
    },
  },
  EditDeliveryAddress: {
    Events: {},
    DirectCallRules: {
      SUCCESS: 'addressbook_changed-alternate_success',
      VALIDATION_ERRORS: 'addressbook_changed-alternate_validation_errors',
      FAILURE: 'addressbook_changed-alternate_failure',
    },
  },
  AddDeliveryAddress: {
    DirectCallRules: {
      SUCCESS: 'addressbook_add-address_success',
      VALIDATION_ERRORS: 'addressbook_add-address_validation_errors',
      FAILURE: 'addressbook_add-address_failure',
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
