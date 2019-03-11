import styled from 'styled-components';
import { media } from '@beans/foundation';
import BeansHeader from '@beans/header';

export const HeaderContainer = styled.div`
  margin-top: 104px;

  ${media.aboveMobileLarge`
    margin-top: 113px;
  `};
`;

export const HeaderStyled = styled(BeansHeader)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;
