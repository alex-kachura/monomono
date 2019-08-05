import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Root } from '@oneaccount/react-foundations';
import { DefaultThemeProvider } from '@beans/theme';
import Breadcrumb from '.';

function renderBreadcrumb(breadcrumb) {
  return render(
    <Root
      breadcrumb={breadcrumb}
      initialData={{}}
      appConfig={{
        region: 'GB',
        config: {
          GB: {
            externalApps: {
              tescoHomepage: 'mock-url',
            },
          },
        },
      }}
      errorFallback={<div>Error Please refresh the page</div>}
    >
      <DefaultThemeProvider>
        <Breadcrumb />
      </DefaultThemeProvider>
    </Root>,
  );
}

describe('Breadcrumb component', () => {
  afterEach(cleanup);

  describe('has breadcrumb', () => {
    it('should render correctly', () => {
      const { asFragment } = renderBreadcrumb([
        {
          href: 'mock-url',
          text: 'mock-text',
        },
      ]);
      const fragment = asFragment();

      expect(fragment).toMatchSnapshot();
    });
  });

  describe('no breadcrumb', () => {
    it('should render correctly', () => {
      const { asFragment } = renderBreadcrumb([]);
      const fragment = asFragment();

      expect(fragment).toMatchSnapshot();
    });
  });
});
