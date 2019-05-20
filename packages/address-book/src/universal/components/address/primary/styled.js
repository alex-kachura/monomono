import styled from 'styled-components';

import Icon from '@beans/icon';
import { BodyText, Signpost } from '@beans/typography';
import { Column } from '@beans/grid';

export const AddressPanelStyled = styled(Column)`
  display: flex;
  flex-direction: column;
  border: 1px solid #cccccc;
  margin-top: 19px;
`;

export const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cccccc;
`;

export const HeaderIcon = styled(Icon)`
  margin: 9px;
`;

export const AddressFooter = styled.div`
  height: 80px;
  flex-shrink: 0;
  padding: 12px;
`;

export const FooterLabel = styled(BodyText)`
  padding-top: 12px !important;
  width: 100%;
`;

export const AddressHeaderText = styled.div`
  padding: 10px 5px 10px 0;
`;

export const HeaderSignpost = styled(Signpost)`
  display: inline-block;
`;

export const HeaderBodyText = styled(BodyText)`
  display: inline-block;
  line-height: 1 !important;
`;
