import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';
import AJV from 'ajv';
import ajvErrors from 'ajv-errors';
import { convertAJVErrorsToFormik, sanitizeValues } from '@oneaccount/react-foundations';
import {
  handleAddressServiceError,
  handleContactServiceError,
  handleError,
  handleValidationErrors,
} from '../../utils/error-handlers';

const ajv = ajvErrors(
  new AJV({ allErrors: true, jsonPointers: true, $data: true, coerceTypes: true }),
  {
    allErrors: true,
  },
);

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

  try {
    address = await clubcardAddressController.getAddress({
      accessToken,
      addressId: id,
      tracer: req.sessionId,
      context: req,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ name, error, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ name, error, req, res, next });
    }

    return handleError(error);
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
  const data = req.body;
  const outcome = 'successful';

  if (!id) {
    return handleError({ name, error: new Error('CONTACT_ADDRESS_ID_REQUIRED'), req, res, next });
  }

  // TODO: Cache schema
  const compiled = ajv.compile(schema);
  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {},
    values: data,
    errors: {},
    fields,
    schema,
  };

  const isValid = compiled(sanitizeValues(data));

  if (!isValid) {
    const errors = convertAJVErrorsToFormik(compiled.errors, schema);

    return handleValidationErrors({ name, errors, payload, req, res, next });
  }
  try {
    await clubcardAddressController.updateAddress({
      accessToken,
      addressIndex: id,
      data,
      context: req,
      tracer: req.sessionId,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ name, error, payload, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ name, error, payload, req, res, next });
    }

    return handleError({ name, error, payload, req, res, next });
  }

  logOutcome(name, outcome, req);

  return res.format({
    html: () => res.redirect(`/account/address-book/${req.lang}?action=clubcard-updated`),
    json: () => {
      res.send({ payload });
    },
  });
}
