import styled from 'styled-components';
import { media } from '@beans/foundation';

export const FormContainer = styled.div`
  width: 100%;
  margin: 0 auto;

  ${media.aboveMobileLarge`
    width: 354px;
  `}

  ${media.aboveTablet`
    width: 480px;
  `}
`;
