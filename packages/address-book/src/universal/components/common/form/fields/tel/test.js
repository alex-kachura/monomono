import React from 'react';
import { render } from '@testing-library/react';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Tel from './';
import { Formik } from '@oneaccount/react-foundations';

const props = {
  id: 'test',
  name: 'test',
  label: 'Test',
  placeholder: 'Test',
  errorMessage: 'Error on field',
  required: true,
};

function renderTel({ value = '', error, telProps }) {
  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
      },
      children: (
        <DefaultThemeProvider>
          <Formik initialValues={{ test: value }} initialErrors={{ test: error }}>
            <Tel {...telProps} />
          </Formik>
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Component: Tel]', () => {
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderTel({ value: '', telProps: props });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Initial Value]', () => {
    it('should render correctly', () => {
      const component = renderTel({
        value: 'Some content',
        telProps: props,
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Error]', () => {
    it('should render correctly', () => {
      const component = renderTel({
        value: '',
        error: 'Error on field',
        telProps: props,
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
