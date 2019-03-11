import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Footer } from './';
import { DefaultThemeProvider } from '@beans/theme';

describe('Footer', () => {
  const mockProps = {
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
    region: 'GB',
    getLocalePhrase: (key) => key,
  };

  it('renders correctly', () => {
    const wrapper = shallow(
      <DefaultThemeProvider>
        <Footer {...mockProps} />
      </DefaultThemeProvider>,
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should open/close closed accordion on click of header', () => {
    const wrapper = mount(
      <DefaultThemeProvider>
        <Footer {...mockProps} />
      </DefaultThemeProvider>,
    );

    expect(
      wrapper
        .find('[aria-controls="footer-accordion-0"]')
        .first()
        .prop('aria-expanded'),
    ).toBe(false);

    wrapper
      .find('.beans-accordion__heading')
      .first()
      .simulate('click');

    expect(
      wrapper
        .find('[aria-controls="footer-accordion-0"]')
        .first()
        .prop('aria-expanded'),
    ).toBe(true);

    wrapper
      .find('.beans-accordion__heading')
      .first()
      .simulate('click');

    expect(
      wrapper
        .find('[aria-controls="footer-accordion-0"]')
        .first()
        .prop('aria-expanded'),
    ).toBe(false);
  });
});
