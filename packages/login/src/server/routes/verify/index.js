import config from 'config';
import { convertAJVErrorsToFormik } from '@oneaccount/react-foundations';
import { logOutcome } from '../../logger';
import controllerFactory from '../../controllers';
import { getPhraseFactory } from '../../utils/i18n';
import { mapPayloadToFields, mapValuesToPayload, setAuthCookies, ajv } from './utils';

export async function getVerifyPage(req, res, next) {
  const verifyController = controllerFactory('verify', req.region);
  const { accessToken } = req.getClaims();

  // Attempt a confidence level 16 handshake
  const {
    authenticated,
    challenge,
    error,
  } = await verifyController.handshake({
    accessToken,
    context: req,
    tracer: req.sessionId,
  });

  // If authenticated, user already has a confidence level 16 token
  if (authenticated) {
    logOutcome('verify:get', 'successful-user-already-16', req);

    // Set cookies for access token, refresh token, etc
    setAuthCookies(req, res, authenticated);

    // Get region-specific login url
    const loginUrl = config[req.region].externalApps.login;

    return res.redirect(loginUrl);
  }

  // If there was an error handshaking, show 500 page
  if (error) {
    logOutcome('verify:get', 'error', req);

    return next(error);
  }

  // Get field objects needed by the UI to render for requested clubcard digits
  // map challenge fields to ui fields?
  const fieldsToRender = mapPayloadToFields(challenge.fields, req.lang, res.isMobile);

  const { schema } = config[req.region];

  logOutcome('verify:get', 'successful-page-load', req);

  res.data = {
    ...res.data,
    payload: {
      values: {
        digit11: '',
        digit12: '',
        digit13: '',
        digit14: '',
      },
      errors: {},
      fields: fieldsToRender,
      schema: {
        ...schema,
        required: fieldsToRender.map((field) => field.name),
      },
      stateToken: challenge.stateToken,
    },
  };

  return next();
}

// Validate all fields against a JSON schema
function doFormValidation(reqBody, schema) {
  const validator = ajv.compile(schema);

  const postedValues = {};

  // Remove state and csrf tokens from posted values
  Object.keys(reqBody).forEach((key) => {
    if (key !== 'state' && key !== '_csrf') {
      postedValues[key] = reqBody[key];
    }
  });

  return {
    isValid: validator(postedValues),
    postedValues,
    validator,
  };
}

// Prepares the payload and reloads the page with error messages
function getInvalidFormPayload({ req, postedValues, validator, schema }) {
  const errors = convertAJVErrorsToFormik(validator.errors, schema);

  // Convert posted values into payload that Identity can understand
  const identityFields = Object.keys(postedValues).map((key) => ({
    id: key,
    value: postedValues[key],
  }));

  // Get field objects needed by the UI to render for requested clubcard digits
  const fieldsToRender = mapPayloadToFields(identityFields, req.lang);

  return {
    values: {
      digit11: postedValues.digit11,
      digit12: postedValues.digit12,
      digit13: postedValues.digit13,
      digit14: postedValues.digit14,
    },
    errors,
    fields: fieldsToRender,
    schema: {
      ...schema,
      required: fieldsToRender.map((field) => field.name),
    },
    stateToken: req.body.state,
  };
}

// Get payload for user entered incorrect values or max tries exceeded (account locked).
function getElevationFailurePayload({ req, res, challenge, accountLocked, schema }) {
  let stateToken;
  let bannerTitle;
  let bannerText;
  let fieldsToRender = [];
  const getLocalePhrase = getPhraseFactory(req.lang);

  if (accountLocked) {
    logOutcome('verify:post', 'error-max-attempts-reached', req);

    bannerTitle = getLocalePhrase('pages.verify.banners.account-locked.title');
  } else {
    logOutcome('verify:post', 'error-incorrect-digits-entered', req);

    bannerTitle = getLocalePhrase('pages.verify.banners.incorrect-digits.title');
    bannerText = getLocalePhrase('pages.verify.banners.incorrect-digits.text');
    stateToken = challenge.stateToken;

    // Get field objects needed by the UI to render for requested clubcard digits
    fieldsToRender = mapPayloadToFields(challenge.fields, req.lang, res.isMobile);
  }

  return {
    banner: {
      type: 'error',
      title: bannerTitle,
      text: bannerText,
    },
    values: {
      digit11: '',
      digit12: '',
      digit13: '',
      digit14: '',
    },
    errors: {},
    fields: fieldsToRender,
    schema: {
      ...schema,
      required: fieldsToRender.map((field) => field.name),
    },
    stateToken,
    accountLocked,
  };
}

export async function postVerifyPage(req, res, next) {
  const verifyController = controllerFactory('verify', req.region);
  const { schema } = config[req.region];

  // Validate the posted fields against the schema
  const { postedValues, isValid, validator } = doFormValidation(req.body, schema);

  // If the form is invalid, e.g. user enters a non-numeric character
  if (!isValid) {
    logOutcome('verify:post', 'invalid-form-posted', req);

    const payload = getInvalidFormPayload({ req, postedValues, validator, schema });

    res.data = { ...res.data, payload };

    res.status(400);

    return next();
  }

  // Map request body values to array of field objects expected by Identity
  const identityFields = mapValuesToPayload(req.body);

  // Request a token elevation via the controller
  const {
    authenticated,
    challenge,
    accountLocked,
    error,
  } = await verifyController.elevateToken({
    fields: identityFields,
    stateToken: req.body.state,
    lang: req.lang,
    context: req,
    tracer: req.sessionId,
  });

  // If access token, it was a success. We have a confidence level 16 token
  if (authenticated) {
    logOutcome('verify:post', 'successful-token-upgrade', req);

    // Set cookies for access token, refresh token, etc
    setAuthCookies(req, res, authenticated);

    // Get region-specific login url
    const loginUrl = config[req.region].externalApps.login;

    return res.redirect(loginUrl);
  }

  // Show 500 page for any unknown service errors
  if (error) {
    logOutcome('verify:post', 'error', req);

    return next(error);
  }

  // If we get here, we have to reload the page.
  // This is either because the user entered incorrect values,
  // or they've exceeded their maximum number of attempts.
  // If max attempts reached, their account is locked for an hour.

  const payload = getElevationFailurePayload({
    req, res, challenge, accountLocked, schema
  });

  res.data = { ...res.data, payload };

  res.status(400);

  return next();
}
