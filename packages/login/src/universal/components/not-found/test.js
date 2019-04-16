import React from 'react';
import NotFoundPage from '.';
import { render, cleanup } from 'react-testing-library';
import { AppProvider } from '@oneaccount/react-foundations';
import { DefaultThemeProvider } from '@beans/theme';

describe('NotFound component', () => {
  afterEach(cleanup);

  function renderComponent() {
    return render(
      <AppProvider
        appConfig={{
          getLocalePhrase: (key) => key,
          config: {
            GB: {
              externalApps: {
                tescoHomepage: '/mock-path',
              },
            },
          },
          region:'GB',
        }}
      >
        <DefaultThemeProvider>
          <NotFoundPage />
        </DefaultThemeProvider>
      </AppProvider>
    );
  }

  it('should render correctly', () => {
    const { asFragment } = renderComponent();
    const fragment = asFragment();

    expect(fragment).toMatchSnapshot();
  });
});
