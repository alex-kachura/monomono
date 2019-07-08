import styled from 'styled-components';
import { Column } from '@beans/grid';
import { media } from '@beans/foundation';

export const ColumnStyled = styled(Column)`
  display: flex;
  flex-direction: column;
`;

export const AdditionalPanelStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 21px;
  background-color: #ffffff;
  overflow: hidden;
  min-height: 300px;

  ${(props) =>
    props.panelButton
      ? `
        border: 1px solid #e5e8ea;
        padding: 0;
        align-items: center;
        justify-content: center;
        min-height: 64px;
      `
      : ''}

  ${media.aboveTablet`
    min-height: 300px;
    flex: 1;
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
