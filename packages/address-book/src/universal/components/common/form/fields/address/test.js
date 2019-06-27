import React from 'react';
import { render, fireEvent, cleanup, waitForDomChange } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Address from './';
import { Formik } from '@oneaccount/react-foundations';

const noop = jest.fn();

const fields = [
  {
    id: 'postcode',
    name: 'postcode',
    label: 'Postcode',
    type: 'text',
    xtype: 'address',
    valuePath: 'postcode',
    placeholder: 'e.g. EC1R 2NT',
    required: true,
  },
];

function renderAddress({ values, fetchFn }) {
  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
        fetch: fetchFn,
        region: 'en-GB',
        config: {
          'en-GB': {
            externalApps: {
              postcodeLookup: 'https://www-local.tesco.com/account/en-GB/address/addresses',
            },
          },
        },
      },
      children: (
        <DefaultThemeProvider>
          <Formik initialValues={values}>
            <Address fields={fields} />
          </Formik>
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Component: Address]', () => {
  afterEach(cleanup);
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderAddress({ values: { postcode: '' } });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Initial Values]', () => {
    it('should render correctly', () => {
      const component = renderAddress({
        values: {
          postcode: 'EC1R 2NT',
        },
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[State: Initial Values]', () => {
    it('should render correctly', () => {
      const component = renderAddress({
        values: {
          postcode: '',
        },
      });

      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe('[Find Address]', () => {
    it('should call fetch and render address list', async () => {
      const fetch = jest.fn(async () => [
        {
          id: 'trn:tesco:address:address:uuid:7634e35e-70d1-4a2e-a3a3-020a3bb8b37e',
          addressLines: [
            { lineNumber: 1, value: 'Barker & Stonehouse Ltd' },
            { lineNumber: 2, value: 'Strawberry Buildings' },
            { lineNumber: 3, value: 'Leazes Park Road' },
          ],
          postcode: 'NE1 4PQ',
          postTown: 'NEWCASTLE UPON TYNE',
        },
      ]);
      const component = renderAddress({
        values: {
          postcode: '',
        },
        fetchFn: fetch,
      });

      const input = component.container.querySelector('input[name=postcode]');
      const button = component.container.querySelector('input[name=postcode] + button');

      fireEvent.change(input, {
        persist: noop,
        target: {
          name: 'postcode',
          value: 'NE1 4PQ',
        },
      });

      fireEvent.click(button, {});

      expect(fetch).toBeCalledWith(expect.stringContaining('?postcode=NE14PQ'), undefined);

      await waitForDomChange();

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
