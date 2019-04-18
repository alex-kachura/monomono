import styled, { createGlobalStyle } from 'styled-components';
import { Grid } from '@beans/grid';

export const GlobalStyle = createGlobalStyle`
  body {
    min-width: 320px;
  }
`;

export const GridStyled = styled(Grid)`
  padding-bottom: 45px;
`;
