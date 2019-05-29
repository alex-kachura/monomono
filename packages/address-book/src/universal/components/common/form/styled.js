import styled from 'styled-components';
import Button from '@beans/button';
import { media } from '@beans/foundation';

export const ButtonStyled = styled(Button)`
  ${media.belowMobileLarge`
    width: 100%;
  `}
`;
