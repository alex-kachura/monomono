import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Breadcrumb from '.';

function renderBreadcrumb(breadcrumb) {
  const providers = renderProviders({
    breadcrumb,
    initialData: {},
    appConfig: {
      region: 'GB',
      config: {
        GB: {
          externalApps: {
            tescoHomepage: 'mock-url',
          },
        },
      },
    },
    children: (
      <DefaultThemeProvider>
        <Breadcrumb />
      </DefaultThemeProvider>
    ),
  });

  return render(providers);
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
