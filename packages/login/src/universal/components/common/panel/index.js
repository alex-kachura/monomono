import styled from 'styled-components';
import { media } from '@beans/foundation';
import { spacing } from '@beans/selectors';

export default styled.div`
  margin-top: ${spacing.lg};
  background-color: white;

  ${media.aboveMobileLarge`
    border: 1px solid #e5e5e5;
    padding: 35px;
    background-color: #f6f6f6;
  `};
`;
