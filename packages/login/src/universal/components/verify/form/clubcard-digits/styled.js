import styled, { css } from 'styled-components';
import { media } from '@beans/foundation';
import Label from '@beans/label';
import Input from '@beans/input';

export const formGroupStyles = css`
  .beans-form-group__children,
  .beans-form-group__error-message {
    padding: 0 12px;

    ${media.aboveMobileLarge`
      padding: 0;
    `}
  }
`;

export const InputStyled = styled(Input)`
  width: 40px;
`;

export const LabelStyled = styled(Label)`
  display: block;
  margin-bottom: 7px;
`;

export const InputGroupStyled = styled.div`
  && {
    display: inline-block;
    margin: 0 24px 0 0;
  }
`;
