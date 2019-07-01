import React from 'react';
import { render } from '@testing-library/react';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { DefaultThemeProvider } from '@beans/theme';
import ClubcardAddressPage from './';

function renderPage() {
  const mockLocation = {
    pathname: 'mock-path',
    search: 'mock-search',
  };

  return render(
    renderProviders({
      appConfig: {
        getLocalePhrase: (key) => key,
        csrf: 'super-secure-token',
      },
      initialPageData: {
        fields: [],
        schema: {},
        errors: {},
        values: {},
      },
      children: (
        <DefaultThemeProvider>
          <ClubcardAddressPage location={mockLocation} />
        </DefaultThemeProvider>
      ),
    }),
  );
}

describe('[Page: ClubcardAddressPage]', () => {
  describe('[State: Default]', () => {
    it('should render correctly', () => {
      const component = renderPage();

      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
