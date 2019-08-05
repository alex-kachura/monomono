import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Root } from '@oneaccount/react-foundations';
import { bold, regular, italic as regularItalic } from '@beans/tesco-modern';
import { StaticRouter } from 'react-router';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { DefaultThemeProvider } from '@beans/theme';
import Spinner from './universal/components/common/spinner';

const globalStyles = {
  tescoModern: {
    inlineFontData: {
      bold,
      regular,
      regularItalic,
    },
    styleNames: ['bold', 'regular', 'regularItalic'],
  },
  normalize: true,
};

export const renderServer = (inititalData, history, routes, context, sheet, url) => {
  const { payload, ...appConfig } = inititalData;

  return ReactDOMServer.renderToString(
    sheet.collectStyles(
      <Root
        initialPageData={payload || {}}
        appConfig={appConfig}
        loadingFallback={<Spinner />}
        errorFallback={<div>Error Please refresh the page</div>}
      >
        <DefaultThemeProvider globalStyles={globalStyles}>
          <StaticRouter location={url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </DefaultThemeProvider>
      </Root>,
    ),
  );
};

export const renderClient = (inititalData, routes, history) => {
  const { payload, ...appConfig } = inititalData;

  ReactDOM.hydrate(
    <Root
      initialPageData={payload || {}}
      appConfig={appConfig}
      loadingFallback={<Spinner />}
      errorFallback={<div>Error Please refresh the page</div>}
    >
      <DefaultThemeProvider globalStyles={globalStyles}>
        <Router history={history}>{renderRoutes(routes)}</Router>
      </DefaultThemeProvider>
    </Root>,
    document.getElementById('main'),
  );
};
