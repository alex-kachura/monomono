import React from 'react';
import Spinner from './';

describe('[Component: Spinner]', () => {
  let component;

  const mockProps = {
    mobileStyles: 'mobile-styles',
    desktopStyles: 'desktop-styles',
  };

  beforeEach(() => {
    component = global.contextualShallow(<Spinner {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
