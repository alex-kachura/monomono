import React from 'react';
import { Breadcrumb } from './';

describe('[Component: Breadcrumb]', () => {
  let component;

  const mockProps = {
    links: [{ href: 'www.testco.com', text: 'Test page' }, { text: 'Test page2' }],
    config: {
      GB: {
        externalApps: {
          tescoHomepage: 'https://www.testco.com',
        },
      },
    },
    region: 'GB',
    getLocalePhrase: (key) => key,
  };

  beforeEach(() => {
    component = global.contextualShallow(<Breadcrumb {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
