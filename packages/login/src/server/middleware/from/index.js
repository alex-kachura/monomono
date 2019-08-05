import express from 'express';
import config from 'config';
import qs from 'querystring';
import url from 'url';

const cookieName = config.get('cookie.onwardLocation.name');
const cookieOptions = config.get('cookie.onwardLocation.options');
const validOnwardLocations = config.get('referrerDomainWhitelist').map((str) => new RegExp(str));

// Add an onward location redirection method to the response object. We should
// use this over "res.redirect" when redirecting to any consumer using the
// "from" parameter. The onward location is defined either on the request state
// or in a cookie. The request state takes priority because this allows us to
// complete a journey before cookies have been set on the client and provides
// a convenient mechanism to override the cookie value.
Reflect.defineProperty(express.response, 'completeJourney', {
  value: function completeJourney({ query } = {}) {
    const res = this;
    const req = this.req;
    const requestStateValue = res.data.onwardLocation;

    let shouldClearCookie;

    let onwardLocation;

    if (requestStateValue) {
      shouldClearCookie = false;
      onwardLocation = decodeURIComponent(requestStateValue);
    } else {
      shouldClearCookie = true;
      onwardLocation = decodeURIComponent(req.cookies[cookieName]);
    }

    // If additional query parameters have been provided we need to add them to
    // the URL.
    if (query) {
      const parsedURL = url.parse(onwardLocation);

      let parsedQueryString = qs.parse(parsedURL.query);

      parsedQueryString = Object.assign({}, parsedQueryString, query);
      parsedURL.query = qs.stringify(parsedQueryString);
      parsedURL.search = `?${parsedURL.query}`;
      onwardLocation = url.format(parsedURL);
    }

    // Clear the cookie containing the onward location so that the user is less
    // likely to be incorrectly redirected the next time they complete their
    // journey (if they access the login page directly without a "from"
    // parameter for example). We do this before any validation so that it
    // happens regardless of the redirect location.
    if (shouldClearCookie) {
      res.clearCookie(cookieName, cookieOptions);
    }

    // To prevent open redirection attacks we will only redirect to URLs that
    // match a whitelist. If the proposed onward location does not match any of
    // the allowed values we redirect to a default location which is most likely
    // the tesco.com homepage.
    const isValidLocation = validOnwardLocations.some((validLocation) =>
      validLocation.test(onwardLocation),
    );

    // Default onward location is tesco.com
    const defaultOnwardLocation = config[req.region].externalApps.tescoHomepage;

    if (!isValidLocation) {
      return res.redirect(defaultOnwardLocation);
    }

    return res.redirect(onwardLocation);
  },
});

// Express middleware function to set a cookie containing the onward location of
// a user once their journey within the MyTesco application is complete.
export default function fromMiddleware(req, res, next) {
  // The "from" query string parameter should be a URL-encoded URL. If it is
  // present its value represents the onward location of the user once their
  // journey is successfully completed. Note that we do not perform any
  // whitelist comparison at this point because there is no need to add that
  // overhead here - it suffices to do the check based on the cookie value at
  // redirection time. We also add an equivalent property to the request state
  // object which can be used in the event that the journey is completed before

  // the cookie is set on the client.
  if (req.query.from) {
    res.data.onwardLocation = encodeURIComponent(req.query.from);

    if (!req.query.bypassFromCookie) {
      res.cookie(cookieName, req.query.from, cookieOptions);
    }
  }

  next();
}
