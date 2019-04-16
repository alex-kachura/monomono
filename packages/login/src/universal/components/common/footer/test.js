import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { DefaultThemeProvider } from '@beans/theme';
import { AppProvider } from '@oneaccount/react-foundations';
import Footer from '.';

function renderFooter() {
  return render(
    <AppProvider
      appConfig={{
        getLocalePhrase: (key) => key,
        config: {
          GB: {
            footerLinks: [
              {
                header: 'Section header',
                links: [
                  {
                    text: 'Footer Link 1',
                    href: 'https://www-ppe.tesco.com/help/',
                  },
                  {
                    text: 'Footer Link 2',
                    href: 'https://www-ppe.tesco.com/help/contact/',
                  },
                ],
              },
            ],
            socialLinks: [
              {
                graphic: 'facebook',
                href: 'https://www.facebook.com/tesco/',
              },
            ],
          },
        },
        region:'GB',
      }}
    >
      <DefaultThemeProvider>
        <Footer />
      </DefaultThemeProvider>
    </AppProvider>
  );
}

describe('Footer', () => {
  it('renders correctly', () => {
    const { asFragment } = renderFooter();
    const component = asFragment();

    expect(component).toMatchSnapshot();
  });

  it('should open/close closed accordion on click of header', () => {
    const { container } = renderFooter();
    const header = container.querySelector('[aria-controls="footer-accordion-0"]');

    expect(header.getAttribute('aria-expanded')).toEqual('false');

    fireEvent.click(header);
    expect(header.getAttribute('aria-expanded')).toEqual('true');

    fireEvent.click(header);
    expect(header.getAttribute('aria-expanded')).toEqual('false');
  });
});
