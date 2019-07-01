import React from 'react';
import { render } from '@testing-library/react';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import Form from './';
import { Formik } from '@oneaccount/react-foundations';

const fields = [
  {
    id: 'address-id',
    name: 'address-id',
    type: 'text',
    label: 'address.fields.address-id.label',
    xtype: 'address',
    placeholder: 'address.fields.address-id.placeholder',
    valuePath: 'id',
    hidden: true,
    required: false,
  },
  {
    id: 'postcode',
    name: 'postcode',
    type: 'text',
    xtype: 'address',
    label: 'address.fields.postcode.label',
    placeholder: 'address.fields.postcode.placeholder',
    valuePath: 'postcode',
    required: true,
  },
  {
    id: 'address-line1',
    name: 'address-line1',
    type: 'text',
    xtype: 'address',
    label: 'address.fields.address-line1.label',
    placeholder: 'address.fields.address-line1.placeholder',
    valuePath: '1',
    required: true,
  },
  {
    id: 'address-line2',
    name: 'address-line2',
    type: 'text',
    xtype: 'address',
    label: 'address.fields.address-line2.label',
    placeholder: 'address.fields.address-line2.placeholder',
    valuePath: '2',
    required: false,
  },
  {
    id: 'address-line3',
    name: 'address-line3',
    type: 'text',
    xtype: 'address',
    label: 'address.fields.address-line3.label',
    placeholder: 'address.fields.address-line3.placeholder',
    valuePath: '3',
    required: false,
  },
  {
    id: 'town',
    name: 'town',
    type: 'text',
    xtype: 'address',
    label: 'address.fields.town.label',
    placeholder: 'address.fields.town.placeholder',
    valuePath: 'postTown',
    required: true,
  },
  {
    id: 'phone-number',
    name: 'phone',
    type: 'tel',
    label: 'pages.clubcard-address.fields.phone-number.label',
    placeholder: 'pages.clubcard-address.fields.phone-number.placeholder',
    required: true,
  },
];

function renderForm() {
  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
      },
      children: (
        <DefaultThemeProvider>
          <Formik>
            <Form
              initialValues={{}}
              url={'/url'}
              onSubmit={jest.fn()}
              title={'pages.delivery-address.title'}
              fields={fields}
              csrf="super-secure-token"
              schema={{}}
            />
          </Formik>
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Component: Form]', () => {
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderForm();

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
