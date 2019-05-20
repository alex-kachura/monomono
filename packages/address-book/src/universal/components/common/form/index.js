import React, { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Address from './fields/address';
import Text from './fields/text';
import Tel from './fields/tel';
import { connect } from 'formik';
import { useAppConfig } from '@oneaccount/react-foundations';
import Button from '@beans/button';

function Form({ fields, csrf, formik, native, onError, submitText = 'Submit' }) {
  const { getLocalePhrase } = useAppConfig();
  const { formRef, handleSubmit, handleNativeSubmit, isSubmitting } = formik;
  const [autoFocus] = useState(() => {
    const { errors } = formik;

    let focus = '';

    for (let i = 0; i < fields.length; i++) {
      const name = fields[i].name;

      if (fields[i].hidden) continue;
      if (!focus) {
        focus = name;
      }

      if (errors[name]) {
        focus = name;
        break;
      }
    }

    return focus;
  });

  const augmentedFields = useMemo(
    () =>
      fields.map((field) => ({
        ...field,
        onError,
      })),
    [onError, fields],
  );

  const addressFields = augmentedFields.reduce((result, field) => {
    if (field.xtype === 'address') {
      result.push({
        ...field,
        autoFocus: autoFocus === field.name,
        label: getLocalePhrase(field.label),
        placeholder: getLocalePhrase(field.placeholder),
      });
    }

    return result;
  }, []);

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
            autoFocus={autoFocus === field.name}
            key={field.name}
            label={getLocalePhrase(field.label)}
            placeholder={getLocalePhrase(field.placeholder)}
          />,
        );
      } else {
        content.push(
          <Text
            {...field}
            autoFocus={autoFocus === field.name}
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
      <Button disabled={isSubmitting} type="submit">
        {submitText}
      </Button>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      xtype: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  ),
  csrf: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    formRef: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleNativeSubmit: PropTypes.func.isRequired,
  }),
  onError: PropTypes.func,
  native: PropTypes.bool,
  submitText: PropTypes.string,
};

export default connect(memo(Form));
