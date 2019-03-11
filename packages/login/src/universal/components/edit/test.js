import React from 'react';
import { fromJS } from 'immutable';
import { EditPage } from './';

describe('[Component: EditPage]', () => {
  let component;
  let mockFieldChange;
  let mockFieldBlur;
  let mockSaveData;
  let mockGetErrorMessage;
  const mockErrorMsg = 'mock-error-msg';

  let mockProps = {
    fields: fromJS([
      {
        id: 'sample1',
        name: 'sample1',
        label: 'pages.edit.fields.sample1.label',
        isValid: true,
        value: '',
        type: 'input',
        hasBlurred: false,
        constraints: [
          {
            type: 'mandatory',
            text: 'pages.edit.fields.sample1.errors.empty',
            validator: true,
            isValid: true,
          },
        ],
      },
    ]),
    csrf: 'mock-csrf',
    getLocalePhrase: (key) => key,
  };

  beforeEach(() => {
    mockFieldChange = jest.fn();
    mockFieldBlur = jest.fn();
    mockSaveData = jest.fn();
    mockGetErrorMessage = jest.fn(() => mockErrorMsg);

    mockProps = {
      ...mockProps,
      saveData: mockSaveData,
      fieldChange: mockFieldChange,
      fieldBlur: mockFieldBlur,
    };

    jest.doMock('../../../utils/validation', () => ({
      getErrorMessage: mockGetErrorMessage,
    }));

    component = global.contextualShallow(<EditPage {...mockProps} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  describe('submitting the form', () => {
    it('should call saveData correctly', () => {
      component.find('form').simulate('submit', { preventDefault: () => false });

      expect(mockSaveData).toHaveBeenCalledWith('sampleData');
    });
  });

  describe('blurring field', () => {
    it('should trigger fieldBlur methd', () => {
      component.find('#sample1-input').simulate('blur', {
        target: {
          value: 'mockValue1',
        },
      });

      expect(mockFieldBlur).toHaveBeenCalledWith({
        fieldName: 'sample1',
        value: 'mockValue1',
        hasBlurred: true,
      });
    });
  });

  describe('changing field', () => {
    it('should trigger fieldChange methd', () => {
      component.find('#sample1-input').simulate('change', {
        target: {
          value: 'mockValue2',
        },
      });

      expect(mockFieldChange).toHaveBeenCalledWith({
        fieldName: 'sample1',
        value: 'mockValue2',
        hasBlurred: false,
      });
    });
  });
});
