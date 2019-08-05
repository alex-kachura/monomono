import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import ClubcardDigits from './clubcard-digits';
import { Analytics } from './analytics';
import { ButtonStyled } from '../../common/styled-components';
import { FormContainer } from './styled';

export function VerifyForm({ fields, stateToken, csrf, formik, onErrors, getLocalePhrase }) {
  const submitRef = useRef();
  const { handleNativeSubmit, formRef, isSubmitting } = formik;

  return (
    <FormContainer>
      <form ref={formRef} autoComplete="off" noValidate method="POST" onSubmit={handleNativeSubmit}>
        <Analytics onErrors={onErrors} />
        <ClubcardDigits fields={fields} submitRef={submitRef} />
        <input type="hidden" name="state" value={stateToken} />
        <input type="hidden" name="_csrf" value={csrf} />
        <ButtonStyled domRef={submitRef} type="submit" variant="primary" disabled={isSubmitting}>
          {getLocalePhrase('pages.verify.buttons.submit')}
        </ButtonStyled>
      </form>
    </FormContainer>
  );
}

VerifyForm.propTypes = {
  formik: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  stateToken: PropTypes.string,
  csrf: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
  onErrors: PropTypes.func.isRequired,
};

export default connect(VerifyForm);
