import log, { logOutcome } from '../../logger';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import { handleResponse } from '../response-handlers';

const UNEXPECTED_BANNER = {
  type: 'error',
  title: 'banners.error.unexpected.title',
  text: 'banners.error.unexpected.text',
};

export function handleValidationErrors({ name, errors, payload, req, res, next }) {
  const data = {
    payload: {
      ...payload,
      errors,
    },
  };

  if (Object.keys(errors).length === 0) {
    logOutcome(name, 'error', req);

    data.payload.banner = UNEXPECTED_BANNER;
  }

  logOutcome(name, 'validation-errors', req);

  return handleResponse({ res, data, next });
}

export function handleAddressServiceError({ name, error, payload = {}, req, res, next }) {
  const errors = {};
  let banner = {};
  let outcome = 'error';

  switch (error.message) {
    case AddressServiceError.Codes.INVALID_ADDRESS:
      error.violations.forEach(({ lineNumber }) => {
        errors[`address-line${lineNumber}`] = `address.fields.address-line${lineNumber}.error`;
        log.warn(
          `address-service:create-address:INVALID_ADDRESS - Invalid address line ${lineNumber} entered`,
          error,
          req,
        );
      });
      outcome = 'validation-errors';
      break;
    case AddressServiceError.Codes.POSTCODE_NOT_FOUND:
      errors.postcode = 'address.fields.postcode.error';
      log.warn(
        'address-service:create-address:POSTCODE_NOT_FOUND - Post code not found',
        error,
        req,
      );
      outcome = 'validation-errors';
      break;
    default:
      banner = UNEXPECTED_BANNER;

      outcome = 'error';

      log.error('address-service:create-address - Unexpected error creating address', error, req);
  }

  logOutcome(name, outcome, req);

  const data = {
    payload: {
      ...payload,
      errors,
      banner,
    },
  };

  return handleResponse({ res, data, next });
}

export function handleContactServiceError({ name, error, payload = {}, req, res, next }) {
  const outcome = 'error';
  let banner = {};

  if (error.message === ContactServiceError.Codes.ADDRESS_NOT_FOUND) {
    log.warn(
      'contact-service:get-single-address:ADDRESS_NOT_FOUND - Address not found',
      error,
      req,
    );

    return next(error);
  }
  banner = UNEXPECTED_BANNER;

  log.error('contact-service:add-address - Unexpected error adding address', error, req);

  if (req.method === 'GET') {
    return next(error);
  }

  const data = {
    payload: {
      ...payload,
      banner,
    },
  };

  logOutcome(name, outcome, req);

  return handleResponse({ res, data, next });
}

export function handleError({ name, error, payload = {}, req, res, next }) {
  let banner = {};

  const outcome = 'error';

  if (error.message === 'NOT_DELIVERY_ADDRESS') {
    // redirect to not found

    log.warn(`${name} - Address is not a delivery address`, error, req);

    return next(error);
  } else if (error.message === 'NOT_CLUBCARD_ADDRESS') {
    // redirect to not found

    log.warn(`${name} - Address is not a club card address`, error, req);

    return next(error);
  } else if (error.message === 'CONTACT_ADDRESS_ID_REQUIRED') {
    log.warn(`${name} - 'id' was not provided`, error, req);

    return next(error);
  }
  log.error(`${name} - Unexpected error`, error, req);

  // Get request don't have any current state.
  // Otherwise return the current state and present a banner
  if (req.method === 'GET') {
    return next(error);
  }

  banner = UNEXPECTED_BANNER;

  const data = {
    payload: {
      ...payload,
      banner,
    },
  };

  logOutcome(name, outcome, req);

  return handleResponse({ res, data, next });
}
