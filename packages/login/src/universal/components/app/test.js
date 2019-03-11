import React from 'react';
import { App } from './';

describe('App component', () => {
  let component;
  let mockDefaultProps;
  let mockConfig;
  let mockRoute;

  beforeEach(() => {
    mockConfig = {
      basePath: 'something',
      appPath: 'app',
      externalApps: {
        gb: {
          login: 'https://secure.testco.com/account/en-GB/login',
          logout: 'https://secure.testco.com/account/en-GB/logout',
          tescoHomepage: 'https://www.testco.com',
        },
      },
      footerLinks: [
        {
          text: 'boo-title',
          links: [
            {
              href: 'www.testco.com',
              text: 'boo',
            },
            {
              href: '#',
              text: 'woo',
            },
          ],
        },
        {
          text: 'hoo-title',
          links: [
            {
              href: 'www.internet.com',
              text: 'hoo',
            },
          ],
        },
      ],
      footerSocialLinks: [
        {
          type: 'facebook',
          href: '#',
        },
        {
          type: 'twitter',
          href: '#',
        },
      ],
      supportLinks: [
        {
          href: '#',
          text: 'foo',
        },
        {
          href: '#',
          text: 'bar',
        },
        {
          href: 'http://www.testco.com',
          text: 'tesco-site',
        },
      ],
    };

    mockRoute = {
      path: '/account/en-GB/manage',
    };

    mockDefaultProps = {
      config: mockConfig,
      route: mockRoute,
      getLocalePhrase: (key) => key,
      setBrowserFlag: Function.prototype,
      region: 'gb',
      isAuthenticated: true,
      waiting: false,
      host: 'mock-host',
      rootPath: '/mock-path',
    };
  });

  describe('not waiting', () => {
    it('should render correctly', () => {
      component = global.contextualShallow(<App {...mockDefaultProps} />);

      expect(component).toMatchSnapshot();
    });
  });

  describe('waiting', () => {
    it('should render correctly', () => {
      mockDefaultProps = {
        ...mockDefaultProps,
        waiting: true,
      };

      component = global.contextualShallow(<App {...mockDefaultProps} />);

      expect(component).toMatchSnapshot();
    });
  });
});
