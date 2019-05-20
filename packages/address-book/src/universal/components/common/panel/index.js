import styled from 'styled-components';
import { media } from '@beans/foundation';
import { spacing } from '@beans/selectors';

export default styled.div`
  margin-top: ${spacing.xxxl};
  background-color: white;
  max-width: 732px;
  margin-left: auto;
  margin-right: auto;

  ${media.aboveMobileLarge`
    margin-top: ${spacing.lg};
    padding: 24px 12px;
    background-color: #f6f6f6;

    > * {
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
  `};
`;
