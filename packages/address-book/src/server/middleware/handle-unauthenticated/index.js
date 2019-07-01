import config from 'config';

export function handleUnauthenticatedFactory({ redirectTo } = {}) {
  return (req, res, next) => {
    let url = config[req.region].externalApps.login;

    if (redirectTo) {
      url = typeof redirectTo === 'string' ? redirectTo : redirectTo(req);
    }

    // If there's no login url configured (e.g. a country whose language config has
    // been added, but there's still no login page ready to intregate), we allow pass-through.
    if (req.isAuthenticated || url === '') {
      return next();
    }

    const fromUrl = encodeURIComponent(`${config.protocol}${req.hostname}${req.baseUrl}${req.url}`);
    // get region-specific login url, e.g. UK or Ireland
    const redirectPath = `${url}?from=${fromUrl}`;

    return res.format({
      // for ajax or fetch requests, we provide the location and return a 401, unauthorised
      json() {
        res.location(redirectPath);

        return res.status(401).end();
      },

      // for standard http requests, we redirect to the login page
      html() {
        return res.redirect(redirectPath);
      },
    });
  };
}

export default handleUnauthenticatedFactory();
