import styled from 'styled-components';
import { media } from '@beans/foundation';

export const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 450px;
`;

export const SpinnerIcon = styled.div`
  background-color: transparent;
  animation: rotation 0.9s infinite linear;
  border: 5px solid #008dca;
  border-top: 5px solid white;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  align-self: center;

  ${({ mobileStyles }) => mobileStyles}
  ${media.aboveMobileLarge`
    ${({ desktopStyles }) => desktopStyles}
  `};

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
