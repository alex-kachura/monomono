import React from 'react';
import VerifyPage from '.';
import { render, cleanup } from '@testing-library/react';
import { Root } from '@oneaccount/react-foundations';
import { DefaultThemeProvider } from '@beans/theme';

const globalStyles = {
  fonts: {
    fileFormats: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
    filePath: '/account/login/fonts',
    styleNames: ['bold', 'regular', 'regularItalic'],
  },
  normalize: true,
};

function renderVerifyPage({ accountLocked }) {
  return render(
    <Root
      initialPageData={{
        banner: {
          type: '',
          title: '',
          text: '',
        },
        accountLocked,
        stateToken: 'mock-token',
        values: {},
        errors: {},
        schema: {},
        fields: [],
        backlink: {},
      }}
      appConfig={{
        getLocalePhrase: (key) => key,
        csrf: 'mock-csrf',
        region: 'GB',
        config: {
          GB: {
            externalApps: {
              tescoSecure: 'mock-tesco-secure',
            },
          },
        },
      }}
      loadingFallback={<div>Looading...</div>}
      errorFallback={<div>Error</div>}
    >
      <DefaultThemeProvider globalStyles={globalStyles}>
        <VerifyPage />
      </DefaultThemeProvider>
    </Root>,
  );
}

describe('VerifyPage component', () => {
  afterEach(cleanup);

  describe('account not locked', () => {
    it('should render correctly', () => {
      const { asFragment } = renderVerifyPage({ accountLocked: false });
      const fragment = asFragment();

      expect(fragment).toMatchSnapshot();
    });
  });

  describe('account locked', () => {
    it('should render correctly', () => {
      const { asFragment } = renderVerifyPage({ accountLocked: true });
      const fragment = asFragment();

      expect(fragment).toMatchSnapshot();
    });
  });
});
