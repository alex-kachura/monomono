import config from 'config';

export function setCookies(res, { accessToken, refreshToken, oauthTokensExpiryTime, uuid }) {
  res.cookie(config.cookie.userAccessToken.name, accessToken, {
    domain: config.cookie.userAccessToken.domain,
    httpOnly: config.cookie.userAccessToken.httpOnly,
    secure: config.cookie.userAccessToken.secure,
  });

  res.cookie(config.cookie.userRefreshToken.name, refreshToken, {
    domain: config.cookie.userRefreshToken.domain,
    httpOnly: config.cookie.userRefreshToken.httpOnly,
    secure: config.cookie.userRefreshToken.secure,
  });

  res.cookie(config.cookie.OAuthTokensExpiryTime.name, JSON.stringify(oauthTokensExpiryTime), {
    domain: config.cookie.OAuthTokensExpiryTime.domain,
    httpOnly: config.cookie.OAuthTokensExpiryTime.httpOnly,
    secure: config.cookie.OAuthTokensExpiryTime.secure,
  });

  // Cookie needs to be single guid without prefix
  // to be consistent across tesco login and register.
  if (uuid.indexOf('trn:tesco:uid:uuid:') > -1) {
    uuid = uuid.split(':').pop(); // eslint-disable-line no-param-reassign
  }

  res.cookie(config.cookie.UUID.name, uuid, {
    domain: config.cookie.UUID.domain,
    httpOnly: config.cookie.UUID.httpOnly,
    secure: config.cookie.UUID.secure,
  });
}
