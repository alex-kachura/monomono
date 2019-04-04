import styled from 'styled-components';
import { media } from '@beans/foundation';
import { spacing } from '@beans/selectors';

export default styled.div`
  margin-top: ${spacing.lg};
  background-color: #f6f6f6;
  border: 1px solid #e5e5e5;
  padding: 12px;

  ${media.aboveMobileLarge`
    padding: 35px;
  `};
`;
