import styled from 'styled-components';
import { RootElement, media } from '@beans/foundation';

export const BreadcrumbBarview = styled(RootElement)`
  padding: 24px 0 8px 0;
  background-color: $bg-grey;
  background-clip: content-box;

  @include screen-xs {
    padding-bottom: 2px;
  }

  ${media.aboveMobile`
    padding-bottom: 2px;
  `};
`;
