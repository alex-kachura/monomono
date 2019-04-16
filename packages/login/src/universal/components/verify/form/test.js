import React from 'react';
import VerifyForm from '.';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import { AppProvider, Formik } from '@oneaccount/react-foundations';
import { DefaultThemeProvider } from '@beans/theme';

expect.extend({ toMatchDiffSnapshot });

describe('VerifyForm component', () => {
  afterEach(cleanup);

  const mockFields = [
    {
      type: 'text',
      name: 'digit11',
      id: 'digit11',
      label: '11th',
    },
      {
      type: 'text',
      name: 'digit12',
      id: 'digit12',
      label: '12th',
    },
    {
      type: 'text',
      name: 'digit13',
      id: 'digit13',
      label: '13th',
    }
  ];

  const mockStateToken = 'mock-state-token';
  const mockCsrf = 'mock-csrf';

  const mockSchema = {
    type: 'object',
    required: [],
    properties: {
      digit11: {
        type: 'integer',
        maxLength: 1,
        errorMessage: 'Please enter the requested digit',
      },
      digit12: {
        type: 'integer',
        maxLength: 1,
        errorMessage: 'Please enter the requested digit',
      },
      digit13: {
        type: 'integer',
        maxLength: 1,
        errorMessage: 'Please enter the requested digit',
      },
      digit14: {
        type: 'integer',
        maxLength: 1,
        errorMessage: 'Please enter the requested digit',
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        digit11: 'Please enter the requested digit',
        digit12: 'Please enter the requested digit',
        digit13: 'Please enter the requested digit',
        digit14: 'Please enter the requested digit',
      },
    },
  };

  const mockInitialErrors = {
    digit11: 'server side error message',
    digit12: 'server side error message',
    digit13: 'server side error message',
  };

  function renderForm(errors = {}) {
    return render(
      <AppProvider
        appConfig={{
          getLocalePhrase: (key) => key,
        }}
      >
        <DefaultThemeProvider>
          <Formik
            initialValues={{
              digit11: '',
              digit12: '',
              digit13: '',
            }}
            initialErrors={errors}
            validationJSONSchema={mockSchema}
          >
            <VerifyForm
              fields={mockFields}
              stateToken={mockStateToken}
              csrf={mockCsrf}
              getLocalePhrase={(key) => key} // eslint-disable-line
            />
          </Formik>
        </DefaultThemeProvider>
      </AppProvider>
    );
  }

  const fireChange = (ele, val) => fireEvent.change(ele, { target: { value: val } });
  const fireKeyDown = (ele, key) => fireEvent.keyDown(ele, { key });

  let noErrorsFragment;

  describe('no initial errors', () => {
    it('should render correctly', () => {
      const { asFragment } = renderForm();

      noErrorsFragment = asFragment();

      expect(noErrorsFragment).toMatchSnapshot();
    });
  });

  describe('has initial errors', () => {
    test('should render error state of form', () => {
      const { asFragment } = renderForm(mockInitialErrors);
      const hasErrorsFragment = asFragment();

      expect(noErrorsFragment).toMatchDiffSnapshot(hasErrorsFragment);
    });
  });

  describe('form keyboard interaction', () => {
    let form;
    let input1;
    let input2;
    let input3;
    let button;

    beforeEach(() => {
      form = renderForm();
      input1 = form.container.querySelector('#digit11');
      input2 = form.container.querySelector('#digit12');
      input3 = form.container.querySelector('#digit13');
      button = form.container.querySelector('button[type=submit]');
    });

    describe('page loads', () => {
      test('should focus on first input', () => {
        expect(input1).toHaveFocus();
      });
    });

    describe('type number in first input', () => {
      test('should focus on 2nd input', () => {
        fireChange(input1, '1');

        expect(input2).toHaveFocus();
      });
    });

    describe('type number in second input', () => {
      test('should focus on 3rd input', () => {
        fireChange(input2, '2');

        expect(input3).toHaveFocus();
      });
    });

    describe('type number in third input', () => {
      test('should focus on submit button', () => {
        fireChange(input3, '3');

        expect(button).toHaveFocus();
      });
    });

    describe('backspace on populated third input', () => {
      test('should keep focus on 3rd input', () => {
        fireChange(input3, '3');
        input3.focus();
        fireKeyDown(input3, 'Backspace');

        expect(input3).toHaveFocus();
      });
    });

    describe('backspace on empty third input', () => {
      test('should focus on 2nd input', () => {
        input3.focus();
        fireKeyDown(input3, 'Backspace');

        expect(input2).toHaveFocus();
      });
    });

    describe('backspace on empty second input', () => {
      test('should focus on 1st input', () => {
        input2.focus();
        fireKeyDown(input2, 'Backspace');

        expect(input1).toHaveFocus();
      });
    });

    describe('backspace on empty first input', () => {
      test('should keep focus on 1st input', () => {
        input1.focus();
        fireKeyDown(input1, 'Backspace');

        expect(input1).toHaveFocus();
      });
    });

    describe('type letter in first input', () => {
      test('should keep focus on 1st input', () => {
        fireChange(input1, 'a');

        expect(input1).toHaveFocus();
      });

      test('should be no change to input', () => {
        fireChange(input1, 'a');

        expect(input1.value).toEqual('');
      });
    });
  });




});


