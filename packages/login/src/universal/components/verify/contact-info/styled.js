import styled from 'styled-components';
import Link from '@beans/link';
import { SectionTitle, BodyText } from '@beans/typography';

export const SectionStyled = styled.section`
  margin-top: 40px;
`;

export const TitleHidden = styled(SectionTitle)`
  visibility: hidden;
  height: 0;
`;

export const PhoneNumbers = styled(BodyText)`
  padding-bottom: 16px !important;
  border-bottom: 1px solid #cccccc !important;
`;

export const FootNote = styled.section`
  margin-top: 20px;
`;

export const Reference = styled(BodyText)`
  position: relative;
  margin-top: 18px !important;
  font-size: 14px !important;
  padding-left: 20px !important;

  &:before {
    position: absolute;
    top: 0;
    left 0;
  }
`;

export const Reference1 = styled(Reference)`
  &:before {
    Content: '*';
  }
`;

export const Reference2 = styled(Reference)`
  &:before {
    Content: '**';
  }
`;

export const NumberLink = styled(Link)`
  font-weight: bold;
`;
