import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { useAppConfig } from '@oneaccount/react-foundations';
import { InputGroupStyled, InputStyled, FormGroupStyled, LabelStyled } from './styled';
import { useFieldLogic, getNumberProps, getFormErrorMsg } from './helpers';

export function ClubcardDigits({ fields, submitRef, formik }) {
  const { getLocalePhrase } = useAppConfig();
  const {
    handleChange,
    handleKeyDown,
  } = useFieldLogic(fields, formik, submitRef);
  const errorMsg = getFormErrorMsg(formik);

  return (
    <FormGroupStyled
      id="clubcard-form-group"
      required
      labelText={getLocalePhrase('pages.verify.digits-prompt')}
      error={!!errorMsg}
      errorMessage={errorMsg}
      labelProps={{ emphasized: false }}
      fieldset
    >
      <div>
        {fields.map(({ name, id, label, type, ref }, index) =>
          <InputGroupStyled key={id}>
            <LabelStyled
              htmlFor={id}
              error={Boolean(formik.errors[name])}
            >
              {label}
            </LabelStyled>
            <InputStyled
              required
              domRef={ref}
              autoFocus={index === 0}
              error={formik.errors[name] ? Boolean(formik.errors[name]) : false}
              labelText={label}
              type={type}
              name={name}
              id={id}
              value={formik.values[name]}
              onBlur={formik.handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength="1"
              // Additional html attributes for mobile devices
              {...getNumberProps(type)}
            />
          </InputGroupStyled>
        )}
      </div>
    </FormGroupStyled>
  );
}

ClubcardDigits.propTypes = {
  fields: PropTypes.array,
  formik: PropTypes.object,
  submitRef: PropTypes.object,
};

export default connect(ClubcardDigits);
