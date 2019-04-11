import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FormGroupStyled } from './styled';
import Input from '@beans/input';

function Text({ id, label, hidden, required, field, form }) {
  const inputEl = useRef();
  const name = field.name;
  const error = field.error || form.errors[name];

  return (
    <FormGroupStyled
      labelText={label}
      id={id}
      required={required}
      error={Boolean(error)}
      errorMessage={error}
    >
      <Input
        hidden={hidden}
        domRef={inputEl}
        type="text"
        name={name}
        id={`${id}-input`}
        value={field.value}
        onChange={field.onChange} // eslint-disable-line react/jsx-handler-names
        onBlur={field.onBlur} // eslint-disable-line react/jsx-handler-names
      />
    </FormGroupStyled>
  );
}

function WrapText({ name, ...props }) {
  return <Field name={name} {...props} component={Text} />;
}

WrapText.propTypes = {
  name: PropTypes.string.isRequired,
};

Text.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
};

export default memo(WrapText);
