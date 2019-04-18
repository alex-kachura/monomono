import React from 'react';
import { render } from 'react-testing-library';
import { renderProviders } from '@oneaccount/react-foundations/lib/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { DefaultThemeProvider } from '@beans/theme';
import EditPage from './';

describe('[Component: EditPage]', () => {
  let component;

  beforeEach(() => {
    const providers = renderProviders({
      appConfig: {
        csrf: 'mock-csrf',
        getLocalePhrase: (key) => key,
        rootPath: '/mock/math',
      },
      children: (
        <DefaultThemeProvider>
          <BrowserRouter>
            <EditPage />
          </BrowserRouter>
        </DefaultThemeProvider>
      ),
    });

    component = render(providers);
  });

  it('should render correctly', () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
