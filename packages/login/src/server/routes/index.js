import express from 'express';
import config from 'config';
import csrf from 'csurf';
import isAuthenticatedFactory from '@web-foundations/express-identity-validate';
import handleUnauthenticated from '../middleware/handle-unauthenticated';
import setResponseData from '../middleware/response-data';
import identity from '../services/identity';
import { getLandingPage } from './landing';
import { getEditPage, postEditPage } from './edit';

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

// All routes are only accessible to logged in users.
appRouter.use(isAuthenticated, handleUnauthenticated);

appRouter.use(
  csrf({
    cookie: {
      key: csrfCookieName,
      ...csrfCookieOptions,
    },
  }),
);

appRouter.use(setResponseData);

appRouter.get('/', getLandingPage);
appRouter.get('/edit', getEditPage);
appRouter.post('/edit', postEditPage);

baseRouter.use(`/${BASE_PATH}/${APP_PATH}/:locale`, appRouter);

export default baseRouter;
