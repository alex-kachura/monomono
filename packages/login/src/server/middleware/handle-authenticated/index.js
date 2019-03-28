import config from 'config';

export default function handleAuthenticated(req, res, next) {
  // Get region-specific login url
  const loginUrl = config[req.region].externalApps.login;

  // User is trying to load verify page but is not authenticated
  if (req.path === '/verify' && !req.isAuthenticated) {

    // Create from query param
    const fromUrl = encodeURIComponent(`${config.protocol}${req.hostname}${req.baseUrl}${req.url}`);

    // This path is the existing login app, but will eventually be login within this app, route '/'
    const redirectPath = `${loginUrl}?from=${fromUrl}`;

    // Redirect to existing login app, maintaining from query parameter of here and where they came from.
    // Upon login the user will be redirected back here, at which point their token will be valid and
    // the verify page will render.
    return res.redirect(redirectPath);
  }

  // The user is authenticated or they're trying to access a route other than '/verify'
  return next();
}
