import React from 'react';
import { render } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { DefaultThemeProvider } from '@beans/theme';
import LandingPage from './';
import { mockData } from './test-data';

describe('[Component: LandingPage]', () => {
  let component;
  const mockLocation = {
    pathname: 'mock-path',
    search: 'mock-search',
  };

  beforeEach(() => {
    const providers = renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
        rootPath: '/mock/math',
      },
      initialPageData: {
        addresses: mockData,
        banner: {
          bannerType: 'error',
          title: '',
          description: '',
        },
      },
      children: (
        <DefaultThemeProvider>
          <BrowserRouter>
            <LandingPage location={mockLocation} />
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
