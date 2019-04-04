import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';

export const renderServer = (store, history, routes, context, sheet, url) =>
  ReactDOMServer.renderToString(
    sheet.collectStyles(
      <Provider store={store}>
        <StaticRouter location={url} context={context}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>,
    ),
  );

export const renderClient = (store, routes, history) => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>{renderRoutes(routes)}</ConnectedRouter>
    </Provider>,
    document.getElementById('main'),
  );
};
