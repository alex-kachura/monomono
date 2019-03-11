import config from 'config';
import { fromJS } from 'immutable';
import DocumentTitle from 'react-document-title';
import serialize from 'serialize-javascript';
import { matchRoutes } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';
import layout from '../layout';
import { getPageName } from '../../utils/analytics';
import createHistory from 'history/createMemoryHistory';
import { renderServer } from '../../renderer';
import routesFactory from '../../universal/routes';
import { configureStore } from '../../universal/store';
import { getDictionary, getPhraseFactory } from '../utils/i18n';

export default function reactRouterRenderMiddlewareFactory() {
  return function reactRouterRenderMiddleware(req, res) {
    const { lang } = req;
    const context = {
      csrfToken: res.data.get('csrf'),
    };
    const history = createHistory({
      initialEntries: [req.originalUrl],
    });

    // Filter the config object against a whitelist to prevent sensitive
    // values being exposed on the client.
    const clientConfig = {};
    const clientRegionalConfig = {};

    config.get('clientConfigWhitelist').forEach((configItem) => {
      if (configItem.scope === 'global') {
        clientConfig[configItem.key] = config[configItem.key];
      } else {
        clientRegionalConfig[configItem.key] = config[req.region][configItem.key];
      }
    });

    // Merge the regional config in to the main client config to keep
    // access method consistent between server and client.
    clientConfig[req.region] = clientRegionalConfig;

    const initialState = fromJS({
      ...res.data.toJS(),
      config: clientConfig,
      lang,
      host: `${config.protocol}${req.hostname}`,
      rootPath: `/${config.basePath}/${config.appPath}/${lang}`,
      getLocalePhrase: getPhraseFactory(lang),
    });

    const store = configureStore(initialState, history);
    const routes = routesFactory(config, lang);
    const sheet = new ServerStyleSheet();
    const html = renderServer(store, history, routes, context, sheet, req.originalUrl);
    const styles = sheet.getStyleTags();
    const branch = matchRoutes(routes, req.path);
    const isNotFound = branch.find((b) => b.route.key === 'NotFound');

    if (context.url) {
      // this is in place if we use the <Redirect> component
      res.redirect(301, context.url);
    } else {
      // eslint-disable-next-line global-require
      const assets = require('../../webpack-assets.json');
      const data = {
        config: clientConfig,
        title: DocumentTitle.rewind(),
        lang,
        dictionary: getDictionary(lang),
      };
      const thirdParties = config.get('thirdParties');

      data.analytics = {
        active: thirdParties.active,
        dataLayer: serialize({
          /* eslint-disable camelcase */
          page_name: getPageName(req.path),
          cont_grp: thirdParties.dataLayer.cont_grp,
          cont_channel: thirdParties.dataLayer.cont_channel,
          cont_server_env: thirdParties.dataLayer.cont_server_env,
          /* eslint-enable camelcase */
        }),
        headerScript: thirdParties.headerScript,
        footerScript: serialize(thirdParties.footerScript),
      };

      data.appDynamics = config.get('appDynamics');

      // if path is not found the set HTTP status code to 404
      if (isNotFound) {
        res.status(404);
      }

      // Generate the response markup and send it to the client.
      res.send(layout(data, html, store.getState(), assets, styles));
    }
  };
}
