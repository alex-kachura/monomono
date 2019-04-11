import path from 'path';
import express from 'express';
import config from 'config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import MobileDetect from 'mobile-detect';
import traceidMiddlewareFactory from '@web-foundations/express-traceid';
import reactRouterRenderMiddleware from './middleware/react-router-render';
import routes from './routes';
import errorHandler from './middleware/error-handler';
import referrerMiddleware from './middleware/referrer';
import localeMiddlewareFactory from '@web-foundations/express-locale-middleware';
import onwardLocation from './middleware/from';
import './middleware/claims';

export default () => {
  // Configure and start an Express server.
  const APP_PORT = config.get('port');
  const app = express();

  app.use(
    `/${config.get('basePath')}/${config.get('appPath')}`,
    express.static(path.join(__dirname, '..', '..', 'dist', 'public')),
  );
  app.use(
    helmet({
      dnsPrefetchControl: false,
    }),
  );
  app.use(
    helmet.contentSecurityPolicy({
      directives: config.get('csp'),
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use((req, res, next) => {
    traceidMiddlewareFactory({
      cookieName: config.cookie.tracer.name,
      cookieOptions: config.cookie.tracer.options,
      reqProperty: 'sessionId',
    })(req, res, next);
  });
  app.use(localeMiddlewareFactory({ locales: config.locales }));
  app.use((req, res, next) => {
    // Set up the initial state object.
    res.data = {
      region: req.region,
      lang: req.lang,
    };

    res.device = new MobileDetect(req.headers['user-agent']);
    res.isMobile = Boolean(res.device.phone() || res.device.tablet());

    next();
  });
  app.use(onwardLocation);
  app.use(referrerMiddleware);
  app.use(routes);
  app.use(reactRouterRenderMiddleware());
  app.use(errorHandler);
  app.enable('trust proxy');
  app.listen(APP_PORT, (error) => {
    if (error) {
      console.error(error); // eslint-disable-line no-console
    } else {
      console.info('Listening on port %s.', APP_PORT); // eslint-disable-line no-console
    }
  });
};
