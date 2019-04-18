import styled from 'styled-components';
import BeansLink from '@beans/link';
import { spacing } from '@beans/selectors';

export const Link = styled(BeansLink)`
  && {
    margin-top: ${spacing.lg};
  }
`;
