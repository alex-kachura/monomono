import express from 'express';
import config from 'config';
import csrf from 'csurf';
import isAuthenticatedFactory from '@web-foundations/express-identity-validate';
import handleUnauthenticated from '../middleware/handle-unauthenticated';
import setResponseData from '../middleware/response-data';
import getIdentityClient from '../services/identity';
import { getLandingPage } from './landing';
import { getAddDeliveryAddressPage, postAddDeliveryAddressPage } from './add-delivery-address';
import { getEditDeliveryAddressPage, postEditDeliveryAddressPage } from './edit-delivery-address';
import { getClubcardAddressPage, postClubcardAddressPage } from './clubcard-address';
import { postDeleteAddressRoute } from './delete-delivery-address';

const { name: csrfCookieName, ...csrfCookieOptions } = config.get('cookie.CSRF');

const BASE_PATH = config.get('basePath');
const APP_PATH = config.get('appPath');

const baseRouter = express.Router(); // eslint-disable-line new-cap
const appRouter = express.Router(); // eslint-disable-line new-cap
const isAuthenticated = isAuthenticatedFactory({
  service: getIdentityClient(),
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
appRouter.post('/', postDeleteAddressRoute);
appRouter.get('/add-delivery-address', getAddDeliveryAddressPage);
appRouter.post('/add-delivery-address', postAddDeliveryAddressPage);
appRouter.get('/edit-delivery-address', getEditDeliveryAddressPage);
appRouter.post('/edit-delivery-address', postEditDeliveryAddressPage);
appRouter.get('/edit-clubcard-address', getClubcardAddressPage);
appRouter.post('/edit-clubcard-address', postClubcardAddressPage);

baseRouter.use(`/${BASE_PATH}/${APP_PATH}/:locale`, appRouter);

export default baseRouter;
