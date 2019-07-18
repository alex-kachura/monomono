import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FormGroupStyled } from '../styled';
import BaseInput from '@beans/input';
import { useAppConfig } from '@oneaccount/react-foundations';

const Input = memo(BaseInput);

const Tel = memo(
  ({
    id,
    label,
    className,
    placeholder,
    hidden,
    required,
    name,
    errorMessage,
    value,
    error,
    onChange,
    onBlur,
    autoFocus,
  }) => {
    const { getLocalePhrase } = useAppConfig();
    const localeError = error ? getLocalePhrase(errorMessage) : undefined;

    return (
      <FormGroupStyled
        labelText={label}
        id={id}
        required={required}
        error={Boolean(error)}
        errorMessage={localeError}
        className={className}
      >
        <Input
          autoFocus={autoFocus}
          hidden={hidden}
          type="text"
          name={name}
          placeholder={placeholder}
          id={id}
          value={value}
          onChange={onChange} // eslint-disable-line react/jsx-handler-names
          onBlur={onBlur} // eslint-disable-line react/jsx-handler-names
        />
      </FormGroupStyled>
    );
  },
);

function WrapTel({ name, ...props }) {
  return (
    <Field name={name} {...props}>
      {({ field, form }) => <Tel {...field} {...props} error={form.errors[name]} />}
    </Field>
  );
}

WrapTel.propTypes = {
  name: PropTypes.string.isRequired,
};

Tel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  error: PropTypes.any,
  errorMessage: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default memo(WrapTel);
