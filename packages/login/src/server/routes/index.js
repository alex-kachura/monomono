import express from 'express';
import config from 'config';
import csrf from 'csurf';
import isAuthenticatedFactory from '@web-foundations/express-identity-validate';
import handleAuthenticated from '../middleware/handle-authenticated';
import setResponseData from '../middleware/response-data';
import identity from '../services/identity';
import { getVerifyPage, postVerifyPage } from './verify';

const { name: csrfCookieName, ...csrfCookieOptions } = config.get('cookie.CSRF');

const BASE_PATH = config.get('basePath');
const APP_PATH = config.get('appPath');

const baseRouter = express.Router(); // eslint-disable-line new-cap
const appRouter = express.Router(); // eslint-disable-line new-cap
const isAuthenticated = isAuthenticatedFactory({
  service: identity,
  getTracer: (req) => req.cookies[config.cookie.tracer.name] || req.sessionId,
});

// Status check. This route is used by automated journeys to determine whether
// or not the app is running.
baseRouter.get(`/${BASE_PATH}/${APP_PATH}/_status`, (req, res) => void res.sendStatus(200));
baseRouter.use(
  new RegExp(
    `^/${BASE_PATH}/${APP_PATH}/(?!(_status$|([A-Z]{2,3}(?:-[A-Z]{2,3}(?:-[A-Z]{4})?)?)))`,
    'i',
  ),
  (req, res) => res.redirect(301, `/${BASE_PATH}/${APP_PATH}/${req.lang}/`),
);

// Check if user is authenticated on all routes and handle this.
appRouter.use(isAuthenticated, handleAuthenticated);

appRouter.use(
  csrf({
    cookie: {
      key: csrfCookieName,
      ...csrfCookieOptions,
    },
  }),
);

appRouter.use(setResponseData);

appRouter.get('/verify', getVerifyPage);
appRouter.post('/verify', postVerifyPage);
baseRouter.use(`/${BASE_PATH}/${APP_PATH}/:locale`, appRouter);

export default baseRouter;
