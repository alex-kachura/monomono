import React from 'react';
import { NotFoundPage } from './';

describe('NotFound component', () => {
  const mockProps = {
    config: {
      GB: {
        externalApps: {
          tescoHomepage: '/mock-path',
        },
      },
    },
    region:'GB',
    getLocalePhrase: (key) => key,
    host: 'mock-host',
    rootPath: '/mock-path',
    region: 'GB',
    config: {
      GB: {
        externalApps: {
          tescoHomepage: 'mock-homepage',
        },
      },
    },
  };

  let component;

  it('should render correctly', () => {
    component = global.contextualShallow(<NotFoundPage {...mockProps} />);

    expect(component).toMatchSnapshot();
  });
});
