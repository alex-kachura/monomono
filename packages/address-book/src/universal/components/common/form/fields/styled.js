import { memo } from 'react';
import styled from 'styled-components';
import FormGroup from '@beans/form-group';
import Button from '@beans/button';

export const FormGroupStyled = memo(
  styled(FormGroup)`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 0 24px;

    div {
      flex-basis: 100%;
    }
  `,
);

export const ButtonStyled = memo(
  styled(Button)`
    margin: 10px 0 0 0;
  `,
);
