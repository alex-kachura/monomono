import styled from 'styled-components';
import { SubHeading, BodyText } from '@beans/typography';
import Button from '@beans/button';

export const ConfirmationSheet = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 300px;

  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 20px 12px;

  display: flex;
  flex-direction: column;

  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  backface-visibility: hidden;
  transform-style: preserve-3d;
`;

export const WrapTextSubHeading = styled(SubHeading)`
  word-wrap: break-word;
  padding: 12px 0 !important;
`;

export const EllipsisBodyText = styled(BodyText)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`;

export const BoldWrapBodyText = styled(BodyText)`
  word-wrap: break-word;
  width: 100%;
  && {
    font-weight: bold;
    color: 000;
  }
`;

export const ButtonStyled = styled(Button)`
  width: 100%;
  margin: 24px 0;
`;

export const Content = styled.div`
  padding: 5px 12px;
  border: solid 1px #cccccc;
  background-color: #f6f6f6;
`;
