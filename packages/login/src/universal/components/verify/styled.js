import styled from 'styled-components';
import { media } from '@beans/foundation';
import { PageTitle, SectionTitle, Heading, BodyText } from '@beans/typography';

export const PageTitleStyled = styled(PageTitle)`
  margin-top: 28px !important;

  ${media.aboveTablet`
    margin-top: 40px !important;
  `}
`;

export const MainCopy = styled(BodyText)`
  margin: 16px 0 ${({ hasBanner }) => hasBanner ? '15' : '19'}px !important;
`;

export const FormSection = styled.section`
  ${media.aboveMobileLarge`
    padding: 28px 0 40px;
    border: solid 1px #e5e5e5;
    background-color: #f6f6f6;
  `}
`;

export const SectionStyled = styled.section`
  margin-top: 20px;
`;

export const TitleStyled = styled(SectionTitle)`
  margin-top: 40px !important;
  font-size: 24px !important;
  line-height: 1.17 !important;
`;

export const HeadingStyled = styled(Heading)`
  margin-top: 24px !important;
  font-size: 16px !important;
`;

export const TextStyled = styled(BodyText)`
  margin: 7px 0 15px !important;
`;
