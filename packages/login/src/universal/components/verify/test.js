import React from 'react';
import { VerifyPage } from './';
import { shallow } from 'enzyme';

describe('[Component: VerifyPage]', () => {
  let component;

  const mockProps = {
    getLocalePhrase: (key) => key,
  };

  beforeEach(() => {
    component = shallow(<VerifyPage {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
