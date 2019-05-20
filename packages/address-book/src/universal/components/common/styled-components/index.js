import styled from 'styled-components';
import BeansLink from '@beans/link';
import { spacing } from '@beans/selectors';
import { media } from '@beans/foundation';
import { PageTitle } from '@beans/typography';

export const PageTitleStyled = styled(PageTitle)`
  && {
    max-width: 756px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }

  && {
    ${media.belowMobileLarge`
      font-size: 24px;
    `}
  }
`;

export const Link = styled(BeansLink)`
  && {
    margin-top: ${spacing.lg};
  }
`;
