import React from 'react';
import { render } from '@testing-library/react';
import { DefaultThemeProvider } from '@beans/theme';
import Banner from '.';

describe('[Component: Banner]', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <DefaultThemeProvider>
        <Banner type="error" title="Banner title" text="Banner text" />
      </DefaultThemeProvider>,
    );

    const fragment = asFragment();

    expect(fragment).toMatchSnapshot();
  });
});
