import React from 'react';
import { render } from '@testing-library/react';
import { DefaultThemeProvider } from '@beans/theme';
import Spinner from '.';

describe('[Component: Spinner]', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <DefaultThemeProvider>
        <Spinner mobileStyles="mobile-styles" desktopStyles="desktop-styles" />
      </DefaultThemeProvider>,
    );
    const fragment = asFragment();

    expect(fragment).toMatchSnapshot();
  });
});
