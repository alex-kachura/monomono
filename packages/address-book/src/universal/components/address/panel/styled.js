import styled from 'styled-components';
import { SubHeading, BodyText } from '@beans/typography';

export const AddressPanelStyled = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  ${(props) =>
    props.additional
      ? `
    padding: 19px 12px;
  `
      : `
    padding: 12px;
  `}
`;

export const WrapTextLabel = styled(BodyText)`
  word-wrap: break-word;
`;

export const WrapTextSubHeading = styled(SubHeading)`
  && {
    margin-bottom: 2px;
  }
  word-wrap: break-word;
  cursor: default;
`;
