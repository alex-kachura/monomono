import React from 'react';
import { LandingPage } from './';

describe('[Component: LandingPage]', () => {
  let component;

  const mockProps = {
    getLocalePhrase: (key) => key,
    rootPath: '/mock/math',
  };

  beforeEach(() => {
    component = global.contextualShallow(<LandingPage {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
