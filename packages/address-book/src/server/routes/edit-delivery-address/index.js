import config from 'config';
import log, { logOutcome } from '../../logger';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import { getPhraseFactory } from '../../utils/i18n';
import AJV from 'ajv';
import ajvErrors from 'ajv-errors';
import { convertAJVErrorsToFormik, sanatizeValues } from '@oneaccount/react-foundations';

function getBreadcrumb(lang, getLocalePhrase) {
  return [
    {
      text: getLocalePhrase('pages.account.title'),
      href: `/${config.basePath}/${lang}/manage`,
    },
    {
      text: getLocalePhrase('pages.landing.title'),
      href: `/${config.basePath}/${config.appPath}/${lang}`,
      useAltLink: true,
    },
    {
      current: true,
      text: getLocalePhrase('pages.delivery-address.edit.title'),
    },
  ];
}

export async function getEditDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { id } = req.query;
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);
  let address = {};
  let outcome = 'successful';

  if (id) {
    // not-found
  }

  try {
    address = await deliveryAddressController.getAddress({
      accessToken,
      addressId: id,
      tracer: req.sessionId,
      context: req,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      if (AddressServiceError.Codes.ADDRESS_NOT_FOUND) {
        // Should never happen??
      }
    } else if (error instanceof ContactServiceError) {
      if (error.message === ContactServiceError.Codes.ADDRESS_NOT_FOUND) {
        log.warn(
          'contact-service:get-single-address:ADDRESS_NOT_FOUND - Address not found',
          error,
          req,
        );
        outcome = 'error';
      }
    } else if (error.message === 'NOT_DELIVERY_ADDRESS') {
      log.warn('delivery-address:edit:get - Address is not a delivery address', error, req);
      outcome = 'error';
    } else {
      outcome = 'error';
      log.error('delivery-address:edit:get - Unexpected error', error, req);
    }
  }

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {},
    values: {
      ...address,
    },
    errors: {},
    fields,
    schema,
  };

  logOutcome('delivery-address:edit:get', outcome, req);

  // TODO: REDIRECT OR SHOW NOT FOUND ERROR

  return res.format({
    html: () => {
      res.data = {
        ...res.data,
        payload,
      };

      next();
    },
    json: () => res.send({ payload }),
  });
}

export async function postEditDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { id } = req.query;
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);

  // Call the controller method based on the region
  // const data = editExample(); // eslint-disable-line
  const data = req.body;
  let errors = {};
  let banner = {};
  let outcome = 'successfull';

  const ajv = ajvErrors(
    new AJV({ allErrors: true, jsonPointers: true, $data: true, coerceTypes: true }),
    {
      allErrors: true,
    },
  );

  // TODO: Cache schema
  const compiled = ajv.compile(schema);
  const isValid = compiled(sanatizeValues(data));

  if (!isValid) {
    errors = convertAJVErrorsToFormik(compiled.errors, schema);
    outcome = 'validations-error';
  } else {
    try {
      await deliveryAddressController.updateAddress({
        accessToken,
        addressIndex: id,
        data,
        context: req,
        tracer: req.sessionId,
      });
    } catch (error) {
      if (error instanceof AddressServiceError) {
        switch (error.message) {
          case AddressServiceError.Codes.INVALID_ADDRESS:
            error.violations.forEach(({ lineNumber }) => {
              errors[
                `address-line${lineNumber}`
              ] = `address.fields.address-line${lineNumber}.error`;
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
            banner = {
              type: 'error',
              title: 'pages.delivery-address.error.service.address.unexpected.title',
              text: 'pages.delivery-address.error.service.address.unexpected.text',
            };

            outcome = 'error';

            log.error(
              'address-service:create-address - Unexpected error creating address',
              error,
              req,
            );
        }
      } else if (error instanceof ContactServiceError) {
        if (error.message === ContactServiceError.Codes.ADDRESS_NOT_FOUND) {
          banner = {
            type: 'error',
            title: 'pages.delivery-address.error.service.contact.unexpected.title',
            text: 'pages.delivery-address.error.service.contact.unexpected.text',
          };

          // TODO: What to do in this situation, since it shouldn't happen but it could happen

          outcome = 'error';
          log.warn('contact-service:get-single-address - Address Not Found', error, req);
        } else {
          banner = {
            type: 'error',
            title: 'pages.delivery-address.error.service.contact.unexpected.title',
            text: 'pages.delivery-address.error.service.contact.unexpected.text',
          };

          outcome = 'error';
          log.error('contact-service:update-address - Unexpected error adding address', error, req);
        }
      } else {
        banner = {
          type: 'error',
          title: 'pages.delivery-address.error.unexpected.title',
          text: 'pages.delivery-address.error.unexpected.text',
        };

        outcome = 'error';
        log.error('delivery-address:edit - Unexpected error', error, req);
      }
    }
  }

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner,
    values: data,
    errors,
    fields,
    schema,
  };

  logOutcome('delivery-address:edit:post', outcome, req);

  if (outcome === 'successful') {
    return res.format({
      html: () => res.redirect(`/account/address-book/${req.locale.type}?action=updated`),
      json: () => {
        res.send({ payload });
      },
    });
  }

  return res.format({
    html: () => {
      res.data = {
        ...res.data,
        payload,
      };

      next();
    },
    json: () => {
      res.send({ payload });
    },
  });
}
