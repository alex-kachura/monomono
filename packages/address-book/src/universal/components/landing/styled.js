import styled from 'styled-components';
import { Grid, Row } from '@beans/grid';
import { PageTitle, SectionTitle, BodyText } from '@beans/typography';
import { media } from '@beans/foundation';

export const LandingPageTitle = styled(PageTitle)`
  ${media.mobileOnly`
    display: none;
  `}

  ${media.belowTablet`
    font-size: 24px!important;
    margin-top: 28px!important;
  `}
`;

export const LandingSection = styled(Grid)`
  ${(props) =>
    props.inverseBackground
      ? `
    position: relative;
    padding-top: 20px;
    padding-bottom: 24px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -9999px;
      right: -9999px;
      background-color: #f6f6f6;
    }
  `
      : `
    padding-top: 24px;
    padding-bottom: 30px;
  `}
`;

export const AddressRow = styled(Row)`
  display: flex;
  flex-grow: 1;
  height: 100%;
  margin-left: -24px;
  margin-right: -24px;

  ${media.aboveTablet`
    align-items: stretch;
  `}
`;

export const OtherAddressesRow = styled(Row)`
  display: flex;
  flex-grow: 1;
  height: 100%;
  margin-left: -24px;
  margin-right: -24px;
`;

export const LandingSectionTitle = styled(SectionTitle)`
  margin-left: -8px !important;
  margin-right: -12px !important;

  ${media.belowTablet`
    font-size: 20px!important;
  `}
`;

export const SubTitle = styled(BodyText)`
  margin-left: -8px !important;
  margin-right: -12px !important;
  margin-top: 4px !important;
  font-size: 20px !important;
`;
