import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Root } from '@oneaccount/react-foundations';
import { StaticRouter } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { DefaultThemeProvider } from '@beans/theme';
import Spinner from '../src/universal/components/common/spinner';

const globalStyles = {
  fonts: {
    fileFormats: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
    filePath: '/account/address-book/fonts',
    styleNames: ['bold', 'regular', 'regularItalic'],
  },
  normalize: true,
};

export const renderServer = (inititalData, routes, context, sheet, url) => {
  const {
    payload: { breadcrumb, ...payload },
    ...appConfig
  } = inititalData;

  return ReactDOMServer.renderToString(
    sheet.collectStyles(
      <Root
        initialPageData={payload || {}}
        appConfig={appConfig}
        breadcrumb={breadcrumb}
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

export const renderClient = (inititalData, routes) => {
  const {
    payload: { breadcrumb, ...payload },
    ...appConfig
  } = inititalData;

  ReactDOM.hydrate(
    <Root
      initialPageData={payload || {}}
      appConfig={appConfig}
      breadcrumb={breadcrumb}
      loadingFallback={<Spinner />}
      errorFallback={<div>Error Please refresh the page</div>}
    >
      <DefaultThemeProvider globalStyles={globalStyles}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </DefaultThemeProvider>
    </Root>,
    document.getElementById('main'),
  );
};
