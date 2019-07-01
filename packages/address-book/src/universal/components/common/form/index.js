import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Address from './fields/address';
import Text from './fields/text';
import Tel from './fields/tel';
import Panel from '../panel';
import Banner from '../banner';
import { PageTitleStyled } from '../styled-components';
import { Formik, useAppConfig } from '@oneaccount/react-foundations';
import { connect } from 'formik';
import { useForm, useFields } from './helpers';
import { ButtonStyled } from './styled';

const Form = memo(({ fields, native, onError, formik, submitText = 'Submit' }) => {
  const { formRef, handleSubmit, handleNativeSubmit, isSubmitting, errors } = formik;
  const { getLocalePhrase, csrf } = useAppConfig();
  const { addressFields, augmentedFields } = useFields(fields, errors, onError);
  const content = [];

  if (addressFields.length > 0) {
    content.push(<Address key={'address'} onError={onError} fields={addressFields} />);
  }

  augmentedFields.forEach((field) => {
    if (field.xtype !== 'address') {
      if (field.type === 'tel') {
        content.push(
          <Tel
            {...field}
            key={field.name}
            label={getLocalePhrase(field.label)}
            placeholder={getLocalePhrase(field.placeholder)}
          />,
        );
      } else {
        content.push(
          <Text
            {...field}
            key={field.name}
            label={getLocalePhrase(field.label)}
            placeholder={getLocalePhrase(field.placeholder)}
          />,
        );
      }
    }
  });

  return (
    <form
      ref={formRef}
      autoComplete="off"
      noValidate
      method="POST"
      onSubmit={native ? handleNativeSubmit : handleSubmit}
    >
      {content}
      <input type="hidden" name="_csrf" value={csrf} />
      <ButtonStyled disabled={isSubmitting} type="submit">
        {submitText}
      </ButtonStyled>
    </form>
  );
});

const ConnectedForm = connect(Form);

function FormWrapper({
  title,
  initialValues,
  initialBanner,
  initialErrors,
  schema,
  url,
  onSubmit,
  onErrors,
  ...rest
}) {
  const { handleSubmit, banner, handleError } = useForm(url, onSubmit, initialBanner);

  return (
    <React.Fragment>
      <PageTitleStyled margin>{title}</PageTitleStyled>
      <Banner {...banner} />
      <Panel>
        <Formik
          initialValues={initialValues}
          initialErrors={initialErrors}
          validationJSONSchema={schema}
          onSubmit={handleSubmit}
          onErrors={onErrors}
        >
          <ConnectedForm onError={handleError} {...rest} />
        </Formik>
      </Panel>
    </React.Fragment>
  );
}

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      xtype: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  ),
  formik: PropTypes.object,
  onError: PropTypes.func,
  native: PropTypes.bool,
  submitText: PropTypes.string,
};

FormWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  initialErrors: PropTypes.object,
  initialBanner: PropTypes.object,
  schema: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onErrors: PropTypes.func,
};

export default memo(FormWrapper);
