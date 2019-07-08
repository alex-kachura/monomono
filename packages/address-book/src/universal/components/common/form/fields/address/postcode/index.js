import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FormGroupStyled, Spinner } from './styled';
import BaseInput from '@beans/input';
import Button from '@beans/button';
import { useAppConfig } from '@oneaccount/react-foundations';

const Input = memo(BaseInput);

const Postcode = memo(
  ({
    id,
    label,
    className,
    placeholder,
    hidden,
    required,
    handleFindAddress,
    name,
    error,
    value,
    onChange,
    onBlur,
    loading,
    domRef,
  }) => {
    const { getLocalePhrase } = useAppConfig();
    const localeError = error ? getLocalePhrase(error) : undefined;

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
          domRef={domRef}
          hidden={hidden}
          type="text"
          name={name}
          placeholder={placeholder}
          id={id}
          value={value}
          onChange={onChange} // eslint-disable-line react/jsx-handler-names
          onBlur={onBlur} // eslint-disable-line react/jsx-handler-names
        />
        {loading && <Spinner />}
        <Button
          disabled={loading}
          variant="primary"
          className="find-address"
          onClick={handleFindAddress}
        >
          {getLocalePhrase('address.find-address')}
        </Button>
      </FormGroupStyled>
    );
  },
);

function WrapPostcode({ name, ...props }) {
  return (
    <Field name={name} {...props}>
      {({ field, form }) => <Postcode {...field} {...props} error={form.errors[name]} />}
    </Field>
  );
}

WrapPostcode.propTypes = {
  name: PropTypes.string.isRequired,
};

Postcode.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
  placeholder: PropTypes.string,
  handleFindAddress: PropTypes.func.isRequired,
  domRef: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

export default memo(WrapPostcode);
