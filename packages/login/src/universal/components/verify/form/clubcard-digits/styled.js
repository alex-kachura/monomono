import styled from 'styled-components';
import FormGroup from '@beans/form-group';
import Label from '@beans/label';
import Input from '@beans/input';

export const InputStyled = styled(Input)`
  width: 40px;
`;

export const FormGroupStyled = styled(FormGroup)`
  legend {
    margin-bottom: 21px !important;
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
