import styled from 'styled-components';
import Link from '@beans/link';
import { SubHeading } from '@beans/typography';
import { media } from '@beans/foundation';

export const AddAddressLink = styled(Link)`
  height: 100%;
  width: 100%;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 12px;
  }

  ${media.belowTablet`

    a {
      justify-content: flex-start;
    }
    
    .beans-link__text {
      margin-left: 12px!important;
    }
  `}
`;

export const LinkSubHeading = styled(SubHeading)`
  color: #00539f !important;
  margin-top: 12px !important;
  white-space: normal !important;

  ${media.aboveTablet`
    text-align: center;
  `}

  ${media.belowTablet`
      margin-top: 0!important;
  `}
`;

export const AddLinkInner = styled.div`
  & > span {
    display: flex;
    flex-direction: column-reverse;

    ${media.belowTablet`
      flex-direction: row-reverse;
    `}
  }
`;
