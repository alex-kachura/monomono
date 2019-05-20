import express from 'express';
import config from 'config';

// eslint-disable-next-line
Reflect.defineProperty(express.request, 'getClaims', {
  value: function getClaims() {
    const accessTokenCookie = config.cookie.userAccessToken;
    const uuidCookie = config.cookie.UUID;

    const accessToken = this.cookies[accessTokenCookie.name];
    const uuid = this.cookies[uuidCookie.name];

    return {
      accessToken,
      uuid,
    };
  },
});
