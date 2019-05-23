import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Root } from '@oneaccount/react-foundations';
import { StaticRouter } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { DefaultThemeProvider } from '@beans/theme';
import { bold, regular, italic as regularItalic } from '@beans/tesco-modern';
import { RootElement } from '@beans/foundation';
import { createGlobalStyle } from 'styled-components';
import Spinner from './universal/components/common/spinner';

export const GlobalStyle = createGlobalStyle`
  body {
    min-width: 320px;
    position: relative;
  }

  #main {
    overflow-x: hidden;
  }
`;

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

export const renderServer = (initialData, routes, context, sheet, url) => {
  const {
    payload: { breadcrumb, ...payload },
    ...appConfig
  } = initialData;

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
          <RootElement>
            <GlobalStyle />
            <StaticRouter location={url} context={context}>
              {renderRoutes(routes)}
            </StaticRouter>
          </RootElement>
        </DefaultThemeProvider>
      </Root>,
    ),
  );
};

export const renderClient = (initialData, routes) => {
  const {
    payload: { breadcrumb, ...payload },
    ...appConfig
  } = initialData;

  ReactDOM.hydrate(
    <Root
      initialPageData={payload || {}}
      appConfig={appConfig}
      breadcrumb={breadcrumb}
      loadingFallback={<Spinner />}
      errorFallback={<div>Error Please refresh the page</div>}
    >
      <DefaultThemeProvider globalStyles={globalStyles}>
        <RootElement>
          <GlobalStyle />
          <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </RootElement>
      </DefaultThemeProvider>
    </Root>,
    document.getElementById('main'),
  );
};
