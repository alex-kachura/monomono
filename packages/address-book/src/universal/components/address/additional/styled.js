import styled from 'styled-components';
import { media } from '@beans/foundation';
import { Column } from '@beans/grid';

export const AdditionalPanelStyled = styled(Column)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  margin-top: 21px;
  background-color: #ffffff;
  overflow: hidden;

  ${media.aboveTablet`
    &:not(:nth-child(3n)) {
      margin-right: 3%;
    }
  `}

  ${(props) =>
    props.panelButton
      ? `
        border: 1px solid #e5e8ea;
        padding: 0;
    `
      : ''}

  ${(props) =>
    props.panelButton &&
    media.belowTablet`
        min-height: 0;
        height: 64px;
    `}
`;

export const AdditionalButtons = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 10px 12px 20px;
`;

export const SeparatingLine = styled.div`
  width: 1px;
  box-sizing: border-box;
  border-left: 1px solid #cccccc;
  margin: 0 12px;
  height: 24px;
`;
