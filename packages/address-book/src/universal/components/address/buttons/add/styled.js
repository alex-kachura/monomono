import styled from 'styled-components';
import Link from '@beans/link';
import { SubHeading } from '@beans/typography';
import { media } from '@beans/foundation';

export const AddAddressLink = styled(Link)`
  && {
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 12px;
    }

    ${media.belowTablet`
      a {
        justify-content: flex-start;
      }
  
      .beans-link__text {
        margin-left: 12px;
      }
    `}
  }
`;

export const LinkSubHeading = styled(SubHeading)`
  && {
    color: #00539f;
    margin-top: 12px;
    white-space: normal;

    ${media.aboveTablet`
      text-align: center;
    `}

    ${media.belowTablet`
      margin-top: 0;
    `}
  }
`;

export const AddLinkInner = styled.div`
  & > span {
    display: flex;
    flex-direction: column;

    ${media.belowTablet`
      flex-direction: row;
    `}
  }
`;
