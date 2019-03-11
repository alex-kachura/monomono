import { flowRight } from 'lodash';

function setCSRFToken(req, data) {
  return data.set('csrf', req.csrfToken());
}

// Set in app data whether or not user is authenticated so React components
// can do any required conditional rendering
function setIsAuth(req, data) {
  return data.set('isAuthenticated', req.isAuthenticated);
}

export default function setResponseData(req, res, next) {
  // Create a function which adds isAuthenticated and CSRF token to response data
  const setAllData = flowRight([setIsAuth.bind(null, req), setCSRFToken.bind(null, req)]);

  res.data = setAllData(res.data);

  next();
}
