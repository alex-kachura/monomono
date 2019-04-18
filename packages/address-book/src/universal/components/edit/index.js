/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Panel from '../common/panel';
import { PageTitle } from '@beans/typography';
import { Formik, connectPage, LocalePhrase, useAppConfig } from '@oneaccount/react-foundations';
import Text from '../../components/common/form/fields/text';
import Address from '../../components/common/form/fields/address';
import { ButtonStyled } from './styled';

const EditPage = ({ initialData: { values: initialValues, errors, schema } }) => {
  const { fetch, getLocalePhrase, csrf } = useAppConfig();

  const handleFormSubmit = useCallback(async (values, actions) => {
    try {
      const data = await fetch(location.pathname, {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (Object.keys(data.payload.errors).length > 0) {
        debugger; // eslint-disable-line
        actions.setErrors(data.payload.errors);
        actions.setSubmitting(false);
      } else {
        actions.setSubmitting(false);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <DocumentTitle title={getLocalePhrase('pages.landing.title')}>
      <React.Fragment>
        <PageTitle margin>
          <LocalePhrase id="pages.edit.title" />
        </PageTitle>
        <Panel>
          <Formik
            initialValues={initialValues}
            initialErrors={errors}
            validationJSONSchema={schema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, formRef }) => (
              <form
                ref={formRef}
                autoComplete="off"
                noValidate
                method="POST"
                onSubmit={handleSubmit}
              >
                <Text id={'name'} name={'name'} label={'Name'} required />
                <Text id={'age'} name={'age'} label={'Age'} required />
                <Text id={'password'} name={'password'} label={'Password'} required />
                <Text
                  id={'confirmPassword'}
                  name={'confirmPassword'}
                  label={'Confirm Password'}
                  required
                />
                <Address />
                <input type="hidden" name="_csrf" value={csrf} />
                <ButtonStyled type="submit">
                  {getLocalePhrase('pages.edit.submit-btn')}
                </ButtonStyled>
              </form>
            )}
          </Formik>
        </Panel>
      </React.Fragment>
    </DocumentTitle>
  );
};

EditPage.propTypes = {
  appConfig: PropTypes.shape({
    csrf: PropTypes.string.isRequired,
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
  }),
};

export default connectPage({
  url: '/account/address-book/en-GB/edit',
})(EditPage);
