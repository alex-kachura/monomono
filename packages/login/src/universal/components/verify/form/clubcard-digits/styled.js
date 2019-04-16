import styled from 'styled-components';
import { media } from '@beans/foundation';
import FormGroup from '@beans/form-group';
import Label from '@beans/label';
import Input from '@beans/input';

export const InputStyled = styled(Input)`
  width: 40px;
`;

export const FormGroupStyled = styled(FormGroup)`
  padding: 0 12px !important;

  ${media.aboveMobileLarge`
    padding: 0 !important;
  `}

  legend {
    margin: 0 0 21px -12px !important;

    ${media.aboveMobileLarge`
      margin: 0 0 21px 0 !important;
    `}
  }
`;

export const LabelStyled = styled(Label)`
  display: block;
  margin-bottom: 7px;
`;

export const InputGroupStyled = styled.div`
  display: inline-block;
  margin-right: 24px;
`;
