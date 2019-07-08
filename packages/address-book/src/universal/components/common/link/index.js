import styled from 'styled-components';
import Link from '@beans/link';
import { spacing } from '@beans/selectors';

export default styled(Link)`
  && {
    margin-top: ${spacing.lg};
  }
`;
