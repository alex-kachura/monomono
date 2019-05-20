import styled from 'styled-components';
import { BaseElement, media } from '@beans/foundation';

export const BreadcrumbBarview = styled(BaseElement)`
  padding: 12px 0 8px 0;
  background-clip: content-box;

  @include screen-xs {
    padding-bottom: 2px;
  }

  ${media.aboveMobile`
    padding-bottom: 2px;
  `};
`;
