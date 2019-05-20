import React from 'react';
import { render } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { DefaultThemeProvider } from '@beans/theme';
import { LandingPage } from './';

describe.skip('[Component: LandingPage]', () => {
  let component;

  beforeEach(() => {
    const providers = renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
        rootPath: '/mock/math',
      },
      children: (
        <DefaultThemeProvider>
          <BrowserRouter>
            <LandingPage />
          </BrowserRouter>
        </DefaultThemeProvider>
      ),
    });

    component = render(providers);
  });

  it('should render correctly', () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
