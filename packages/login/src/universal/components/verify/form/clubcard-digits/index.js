import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import FormGroup from '@beans/form-group';
import { useAppConfig } from '@oneaccount/react-foundations';
import { InputGroupStyled, InputStyled, LabelStyled, formGroupStyles } from './styled';
import { useFieldLogic, getNumberProps } from './helpers';

export function ClubcardDigits({ fields, submitRef, formik }) {
  const { getLocalePhrase } = useAppConfig();
  const { handleChange, handleKeyDown } = useFieldLogic(fields, formik, submitRef);
  const errorMsg = Boolean(formik.errors && Object.keys(formik.errors).length > 0);

  return (
    <FormGroup
      id="clubcard-form-group"
      required
      labelText={getLocalePhrase('pages.verify.digits-prompt')}
      error={errorMsg}
      errorMessage={getLocalePhrase('pages.verify.error-msg')}
      labelProps={{ emphasized: false }}
      fieldset
      styles={formGroupStyles}
    >
      {fields.map(({ name, id, label, type, ref }, index) => (
        <InputGroupStyled key={id}>
          <LabelStyled htmlFor={id} error={Boolean(formik.errors[name])}>
            {label}
          </LabelStyled>
          <InputStyled
            required
            domRef={ref}
            autoFocus={index === 0}
            error={formik.errors[name] ? Boolean(formik.errors[name]) : false}
            labelText={label}
            aria-label={`${label} clubcard number ${
              formik.errors[name]
                ? `${getLocalePhrase('pages.verify.aria-label.error-field')}`
                : `${getLocalePhrase('pages.verify.aria-label.empty-field')}`
            }`}
            type={type}
            name={name}
            id={id}
            value={formik.values[name]}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength="1"
            // Additional html attributes for mobile devices
            {...getNumberProps(type)}
          />
        </InputGroupStyled>
      ))}
    </FormGroup>
  );
}

ClubcardDigits.propTypes = {
  fields: PropTypes.array,
  formik: PropTypes.object,
  submitRef: PropTypes.object,
};

export default connect(ClubcardDigits);
