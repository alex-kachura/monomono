import styled from 'styled-components';
import { SubHeading, BodyText } from '@beans/typography';

export const ConfirmationSheet = styled.div`
    position: absolute;
    top 0;
    left: 0;
    bottom: 0;
    right: 0;

    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    padding: 35px;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
`;

export const WrapTextSubHeading = styled(SubHeading)`
  word-wrap: break-word;
  padding: 12px 0 !important;
`;

export const WrapBodyText = styled(BodyText)`
  word-wrap: break-word;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 12px;

  & > button {
    margin: 0 5px;
  }
`;
