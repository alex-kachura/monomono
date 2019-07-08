import styled from 'styled-components';
import { media } from '@beans/foundation';
import { PageTitle } from '@beans/typography';

export default styled(PageTitle)`
  && {
    max-width: 756px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;

    ${media.belowMobileLarge`
      font-size: 24px;
    `}
  }
`;
