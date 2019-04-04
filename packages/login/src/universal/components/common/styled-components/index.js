import styled from 'styled-components';
import { media } from '@beans/foundation';
import BeansLink from '@beans/link';
import Input from '@beans/input';
import Button from '@beans/button';
import { spacing } from '@beans/selectors';

export const Link = styled(BeansLink)`
  && {
    margin-top: ${spacing.lg};
  }
`;

export const InputContainer = styled.div`
  margin-bottom: 24px;
`;

export const InputStyled = styled(Input)`
  &[type='text'] {
    border-color: ${({ error }) => (error ? '#cc3333' : '#ccc')};
  }
`;

export const ButtonStyled = styled(Button)`
  width: 100%;

  ${media.aboveMobileLarge`
    width: auto;
  `};
`;
