import React from 'react';
import { VerifyPage } from './';
import { shallow } from 'enzyme';

describe('[Component: VerifyPage]', () => {
  let component;

  const mockFields = [
    {
      name: 'mock-name',
      id: 'mock-id',
      label: 'mock label',
      isValid: true,
      value: '',
      type: 'input',
      constraints: [
        {
          type: 'mandatory',
          text: 'mock label',
          validator: true,
          isValid: true,
        },
        {
          type: 'regex',
          text: 'mock label',
          validationRegex: '^.{1,1}$',
          isValid: true,
        },
      ],
    }
  ];

  let mockProps = {
    fields: [],
    banner: {},
    stateToken: 'state-token',
    csrf: 'csrf-token',
    getLocalePhrase: (key) => key,
  };

  describe('account not locked', () => {
    describe('fields', () => {
      it('should render correctly', () => {
        mockProps = {
          ...mockProps,
          fields: mockFields,
        };
        component = shallow(<VerifyPage {...mockProps} />);

        expect(component).toMatchSnapshot();
      });
    });

    describe('no fields', () => {
      it('should render correctly', () => {
        component = shallow(<VerifyPage {...mockProps} />);

        expect(component).toMatchSnapshot();
      });
    });
  });

  describe('account locked', () => {
    it('should render correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });
});
