import { IdentityServiceError } from '@web-foundations/service-identity';
import identity from '../../services/identity';
import log from '../../logger';

function handleResponse(res) {
  // If there's an access token, user is already at confience level 16
  if (res && res.access_token) {
    return {
      authenticated: {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expires: res.expires_in,
        claims: res.Claims,
      },
    };
  }

  // If fields were returned, it means Identity have sent a challenge
  // to the customer to verify their details.
  // Return these fields to the consuming app to render
  if (res && res.primary && res.primary.fields) {
    return {
      challenge: {
        fields: res.primary.fields,
        stateToken: res.state,
      },
    };
  }

  // Is it possible to not get an access token and not get fields to render?
  return {
    error: new Error('Expected response from Identity'),
  };
}

export async function handshake({ accessToken, context, tracer }) {
  let res;

  try {
    // Call handshake with confidence level 16
    res = await identity.handshake({
      targetConfidence: 16,
      accessToken,
      context,
      tracer,
    });

    return handleResponse(res);
  } catch(error) {
    log.error('error doing level 16 handshake', error, context);

    return { error };
  }
}

export async function elevateToken({ fields, stateToken, context, tracer }) {
  let res;

  try {
    // Call Identity with values for clubcard digits, requesting that
    // the user's session be elevated to confidence level 16
    res = await identity.elevateToken({
      stateToken,
      clubcardFields: fields,
      context,
      tracer,
    });

    return handleResponse(res);
  } catch(error) {
    if (error.message === IdentityServiceError.Codes.ACCOUNT_LOCKED_ONE_HOUR) {
      log.warn('max tries reached, account locked', error, context);

      return {
        accountLocked: true,
      };
    }

    log.error('error elevating user token', error, context);

    return { error };
  }
}
