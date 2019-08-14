import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DefaultThemeProvider } from '@beans/theme';
import { AppProvider } from '@oneaccount/react-foundations';
import App from '.';

describe('App component', () => {
  window.scrollTo = jest.fn();
  it('should render correctly', () => {
    const mockRoute = {
      routes: [],
    };
    const mockLocation = {
      pathname: '/address-book',
      search: '',
    };

    const { asFragment } = render(
      <BrowserRouter>
        <AppProvider
          appConfig={{
            config: {
              GB: {
                externalApps: {
                  login: 'mock-login-url',
                },
                header: {
                  menu: [],
                  branding: {
                    href: 'https://tesco.com',
                  },
                  mobileMenuItem: {
                    href: '/',
                    text: 'header.menu.title',
                  },
                  selectedMenuItemID: 'utility-tesco',
                },
                footerLinks: [
                  {
                    header: 'header1.title',
                    links: [],
                  },
                  {
                    header: 'header2.title',
                    links: [],
                  },
                  {
                    header: 'header3.title',
                    links: [],
                  },
                  {
                    header: 'header4.title',
                    links: [],
                  },
                ],
              },
            },
            region: 'GB',
            isAuthenticated: true,
            getLocalePhrase: (key) => key,
          }}
        >
          <DefaultThemeProvider>
            <App route={mockRoute} location={mockLocation} />
          </DefaultThemeProvider>
        </AppProvider>
      </BrowserRouter>,
    );

    const fragment = asFragment();

    expect(fragment).toMatchSnapshot();
  });
});
