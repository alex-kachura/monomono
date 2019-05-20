import styled from 'styled-components';
import FormGroup from '@beans/form-group';
import { SpinnerIcon } from '../../../../spinner/styled';

export const FormGroupStyled = styled(FormGroup)`
  .beans-form-group__children > * {
    margin-bottom: 0;
  }

  input {
    display: inline-block;
    margin-right: 24px;
    width: 132px;
  }

  button {
    display: inline-block;
    width: 140px;

    &:hover,
    &:focus {
      box-shadow: 0 0 0 4px rgba(0, 83, 159, 0.4);
    }
  }
`;

export const Spinner = styled(SpinnerIcon)`
  width: 22px;
  height: 22px;
  border: 4px solid #008dca;
  border-top: 4px solid white;
  top: 5px;
  left: 97px;
  display: inline-block;
  position: absolute;
`;
