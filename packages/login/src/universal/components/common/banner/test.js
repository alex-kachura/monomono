import React from 'react';
import Banner from './';

describe('[Component: Banner]', () => {
  let component;

  const mockProps = {
    getLocalePhrase: (key) => key,
  };

  beforeEach(() => {
    component = global.contextualShallow(<Banner {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
