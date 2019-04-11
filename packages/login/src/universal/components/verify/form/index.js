import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import ClubcardDigits from './clubcard-digits';
import { ButtonStyled } from '../../common/styled-components';
import { FormContainer } from './styled';

export function VerifyForm({
  fields,
  submitRef,
  stateToken,
  csrf,
  formik,
  getLocalePhrase,
}) {
  const { handleNativeSubmit, formRef, isSubmitting } = formik;

  return (
    <FormContainer>
      <form
        ref={formRef}
        autoComplete="off"
        noValidate
        method="POST"
        onSubmit={handleNativeSubmit}
      >
        <ClubcardDigits fields={fields} submitRef={submitRef} />
        <input type="hidden" name="state" value={stateToken} />
        <input type="hidden" name="_csrf" value={csrf} />
        <ButtonStyled
          domRef={submitRef}
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {getLocalePhrase('pages.verify.buttons.submit')}
        </ButtonStyled>
      </form>
    </FormContainer>
  );
}

VerifyForm.propTypes = {
  formik: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  submitRef: PropTypes.object,
  stateToken: PropTypes.string,
  csrf: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
};

export default connect(VerifyForm);
