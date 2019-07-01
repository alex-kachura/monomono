import React from 'react';
import { render } from '@testing-library/react';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Text from './';
import { Formik } from '@oneaccount/react-foundations';

const props = {
  id: 'test',
  name: 'test',
  label: 'Test',
  placeholder: 'Test',
  required: true,
};

function renderText({ value = '', error, textProps }) {
  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
      },
      children: (
        <DefaultThemeProvider>
          <Formik initialValues={{ test: value }} initialErrors={{ test: error }}>
            <Text {...textProps} />
          </Formik>
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Component: Text]', () => {
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderText({ value: '', textProps: props });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Initial Value]', () => {
    it('should render correctly', () => {
      const component = renderText({
        value: 'Some content',
        textProps: props,
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Error]', () => {
    it('should render correctly', () => {
      const component = renderText({
        value: '',
        error: 'Error on field',
        textProps: props,
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
