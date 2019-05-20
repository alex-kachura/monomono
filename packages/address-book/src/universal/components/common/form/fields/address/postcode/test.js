import React from 'react';
import { render } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Postcode from './';
import { Formik } from '@oneaccount/react-foundations';

const postcodeProps = {
  id: 'postcode',
  name: 'postcode',
  label: 'Postcode',
  placeholder: 'e.g. EC1R 2NT',
  required: true,
  handleFindAddress: jest.fn(),
};

function renderPostcode({ value = '', error = null, fetchFn }) {
  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
        fetch: fetchFn,
      },
      children: (
        <DefaultThemeProvider>
          <Formik initialValues={{ postcode: value }} initialErrors={{ postcode: error }}>
            <Postcode {...postcodeProps} />
          </Formik>
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Component: Postcode]', () => {
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderPostcode({ value: '' });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Initial Value]', () => {
    it('should render correctly', () => {
      const component = renderPostcode({
        value: 'EC1R 2NT',
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Error]', () => {
    it('should render correctly', () => {
      const component = renderPostcode({
        value: 'EC1R 2NT',
        error: 'Error on field',
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
