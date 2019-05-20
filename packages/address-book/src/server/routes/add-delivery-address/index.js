import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import log, { logOutcome } from '../../logger';
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
      text: getLocalePhrase('pages.delivery-address.add.title'),
    },
  ];
}

export function getAddDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['delivery-address'];

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      type: '',
      title: '',
      errorType: '',
    },
    values: {
      postcode: '',
      'address-line1': '',
      'address-line2': '',
      'address-line3': '',
      town: '',
      'address-id': '',
      day: '',
      evening: '',
      mobile: '',
      'address-label': '',
    },
    errors: {},
    fields,
    schema,
  };

  logOutcome('delivery-address:add:get', 'successful', req);

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

export async function postAddDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);

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
    outcome = 'validation-errors';
  } else {
    try {
      await deliveryAddressController.createAddress({
        accessToken,
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
        banner = {
          type: 'error',
          title: 'pages.delivery-address.error.service.contact.unexpected.title',
          text: 'pages.delivery-address.error.service.contact.unexpected.text',
        };

        outcome = 'error';
        log.error('contact-service:add-address - Unexpected error adding address', error, req);
      } else {
        banner = {
          type: 'error',
          title: 'pages.delivery-address.error.unexpected.title',
          text: 'pages.delivery-address.error.unexpected.text',
        };

        outcome = 'error';
        log.error('delivery-address:add - Unexpected error', error, req);
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

  logOutcome('delivery-address:add:post', outcome, req);

  if (outcome === 'successful') {
    return res.format({
      html: () => res.redirect(`/account/address-book/${req.locale.type}?action=added`),
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
