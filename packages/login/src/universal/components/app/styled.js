import styled, { createGlobalStyle } from 'styled-components';
import { media, RootElement } from '@beans/foundation';
import { Grid } from '@beans/grid';

export const GlobalStyle = createGlobalStyle`
  body {
    min-width: 320px;
  }
`;

export const AppContainer = styled(RootElement)`
  ${media.aboveMobileLarge`
    background-color: white;
  `};
`;

export const GridStyled = styled(Grid)`
  padding-bottom: 45px;
`;

