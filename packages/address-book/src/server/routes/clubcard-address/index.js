import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';
import { validate } from '@oneaccount/react-foundations';
import {
  handleAddressServiceError,
  handleContactServiceError,
  handleError,
  handleValidationErrors,
  handleMissingIdError,
  ErrorCodes,
} from '../../utils/error-handlers';

export function getBreadcrumb(req, getLocalePhrase) {
  return [
    {
      text: getLocalePhrase('pages.account.title'),
      href: config[req.region].externalApps.myAccount,
    },
    {
      text: getLocalePhrase('pages.landing.title'),
      href: `/${config.basePath}/${config.appPath}/${req.lang}`,
      useAltLink: true,
    },
    {
      current: true,
      text: getLocalePhrase('pages.clubcard-address.edit.title'),
    },
  ];
}

export async function getClubcardAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { id } = req.query;
  const { fields, schema } = config[req.region].pages['clubcard-address'];
  const { accessToken } = req.getClaims();
  const clubcardAddressController = controllerFactory('clubcardAddress.default', req.region);
  let address = {};
  const outcome = 'successful';
  const name = 'clubcard-address:edit:get';
  const action = 'get-address';

  if (!id) {
    return handleError({
      name,
      error: new Error(ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED),
      req,
      res,
      next,
    });
  }

  try {
    address = await clubcardAddressController.getAddress({
      accessToken,
      addressId: id,
      tracer: req.sessionId,
      context: req,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ name, action, error, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ name, action, error, req, res, next });
    }

    return handleError({ name, action, error, req, res, next });
  }

  const payload = {
    breadcrumb: getBreadcrumb(req, getLocalePhrase),
    banner: {},
    values: {
      ...address,
    },
    errors: {},
    fields,
    schema,
  };

  logOutcome(name, outcome, req);

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

export async function postClubcardAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['clubcard-address'];
  const { id } = req.query;
  const { accessToken } = req.getClaims();
  const clubcardAddressController = controllerFactory('clubcardAddress.default', req.region);
  const name = 'clubcard-address:edit:post';
  const { _csrf, ...data } = req.body; // eslint-disable-line no-unused-vars
  const outcome = 'successful';
  const action = 'update-address';

  if (!id) {
    return handleMissingIdError({
      name,
      error: new Error(ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED),
      req,
      res,
      next,
    });
  }

  const payload = {
    breadcrumb: getBreadcrumb(req, getLocalePhrase),
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
    await clubcardAddressController.updateAddress({
      accessToken,
      addressIndex: id,
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

  logOutcome(name, outcome, req);

  return res.format({
    html: () => res.redirect(`/account/address-book/${req.lang}?action=clubcard-updated`),
    json: () => {
      res.send({ payload });
    },
  });
}
