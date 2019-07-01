import config from 'config';
import get from 'lodash/get';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';
import { validate } from '@oneaccount/react-foundations';
import {
  handleValidationErrors,
  handleAddressServiceError,
  handleContactServiceError,
  handleError,
} from '../../utils/error-handlers';

export function getBreadcrumb(lang, getLocalePhrase) {
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
  const isOldAddressBook = /disabled/.test(get(req, 'cookies.myaccount_segment_singleAddressBook'));

  if (isOldAddressBook) {
    return res.redirect(config[req.region].externalApps.accountAddressBookAddAddress);
  }

  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['delivery-address'];

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {},
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
  const action = 'create-address';
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);
  const { _csrf, ...data } = req.body; // eslint-disable-line no-unused-vars
  const name = 'delivery-address:add:post';

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {},
    values: data,
    errors: {},
    fields,
    schema,
  };

  const { isValid, values, errors } = validate(schema, data);

  if (!isValid) {
    return handleValidationErrors({
      name,
      action,
      errors,
      payload,
      req,
      res,
      next,
    });
  }

  try {
    await deliveryAddressController.createAddress({
      accessToken,
      data: values,
      context: req,
      tracer: req.sessionId,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ name, action, error, payload, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ name, action, error, payload, req, res, next });
    }

    return handleError({ name, action, error, payload, req, res, next });
  }

  logOutcome(name, 'successful', req);

  return res.format({
    html: () => res.redirect(`/account/address-book/${req.lang}?action=added`),
    json: () => res.send({ payload }),
  });
}
