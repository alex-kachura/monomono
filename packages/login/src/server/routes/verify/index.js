import { logOutcome } from '../../logger';
import controllerFactory from '../../controllers';
import { mapPayloadToFields, mapValuesToPayload, sendToLogin } from './utils';

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
    logOutcome('get:verify', 'successful-user-already-16', req);

    return sendToLogin(req, res, authenticated);
  }

  // If there was an error handshaking, show 500 page
  if (error) {
    logOutcome('get:verify', 'error', req);

    return next(error);
  }

  // Get field objects needed by the UI to render for requested clubcard digits
  const fieldsToRender = mapPayloadToFields(challenge.fields, req.lang);

  const payload = {
    breadcrumb: [],
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
    form: {
      fields: fieldsToRender,
      focusFieldId: undefined,
      isFormValid: true,
      formSubmitted: false,
    },
    stateToken: challenge.stateToken,
  };

  logOutcome('get:verify', 'successful-page-load', req);

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

export async function postVerifyPage(req, res, next) {
  const verifyController = controllerFactory('verify', req.region);

  // Map clubcard didit request body values to fields expected by Identity
  const payloadFields = mapValuesToPayload(req.body);

  // Request a token elevation via the controller
  const {
    authenticated,
    challenge,
    accountLocked,
    error,
  } = await verifyController.elevateToken({
    fields: payloadFields,
    stateToken: req.body.state,
    lang: req.lang,
    context: req,
    tracer: req.sessionId,
  });

  // If access token, it was a success. We have a confidence level 16 token
  if (authenticated) {
    logOutcome('post:verify', 'successful-token-upgrade', req);

    return sendToLogin(req, res, authenticated);
  }

  if (error) {
    logOutcome('post:verify', 'error', req);

    return next(error);
  }

  // If we get here, we have to reload the page.
  // This is either because the user entered incorrect values,
  // or they've exceeded their maximum number of attempts.
  // If max attempts reached, their account is locked for an hour.

  let bannerTitle;
  let fieldsToRender = [];
  let stateToken;

  if (accountLocked) {
    logOutcome('post:verify', 'error-max-attempts-reached', req);

    bannerTitle = 'Too many failures, locked out';
  } else {
    logOutcome('post:verify', 'error-incorrect-digits-entered', req);

    bannerTitle = 'Wrong, please try again';
    stateToken = challenge.stateToken;

    // Get field objects needed by the UI to render for requested clubcard digits
    fieldsToRender = mapPayloadToFields(challenge.fields, req.lang);
  }

  const payload = {
    breadcrumb: [],
    banner: {
      bannerType: 'error',
      title: bannerTitle,
      errorType: '',
    },
    accountLocked,
    form: {
      fields: fieldsToRender,
      focusFieldId: undefined,
      isFormValid: true,
      formSubmitted: false,
    },
    stateToken,
  };

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
