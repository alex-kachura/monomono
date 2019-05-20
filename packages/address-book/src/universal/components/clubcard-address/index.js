/* eslint-disable react/jsx-no-bind */

import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Panel from '../common/panel';
import Form from '../common/form';
import Banner from '../common/banner';
import { PageTitleStyled } from '../common/styled-components';
import { Formik, connectPage, LocalePhrase, useAppConfig } from '@oneaccount/react-foundations';

function useFormSubmit(url, history, setBanner) {
  const { fetch } = useAppConfig();
  const handleSubmit = useCallback(async (values, { setSubmitting, setErrors }) => {
    const { payload } = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const { banner = {}, errors } = payload;
    const hasErrors = Object.keys(errors).length > 0;

    ReactDOM.unstable_batchedUpdates(() => {
      if (banner) {
        setBanner(banner);
      }

      if (hasErrors) {
        setErrors(errors);
      }

      setSubmitting(false);
    });

    if (banner.type !== 'error' && !hasErrors) {
      history.replace('/account/address-book/en-GB?action=clubcard-updated');
    }
  }, []);

  return handleSubmit;
}

const ClubcardAddressPage = ({
  history,
  location,
  initialData: { banner: initialBanner, values: initialValues, fields, errors, schema },
}) => {
  const { getLocalePhrase, csrf } = useAppConfig();
  const [banner, setBanner] = useState(initialBanner);

  const handleError = useCallback((error) => {
    if (error.message === 'Unexpected Response from Server') {
      setBanner({
        type: 'error',
        title: getLocalePhrase('pages.delivery-address.error.unexpected.title'),
        text: getLocalePhrase('pages.delivery-address.error.unexpected.text'),
      });

      return false;
    }

    throw error;
  }, []);
  const handleSubmit = useFormSubmit(`${location.pathname}${location.search}`, history, setBanner);

  return (
    <DocumentTitle title={getLocalePhrase('pages.clubcard-address.edit.title')}>
      <React.Fragment>
        <PageTitleStyled margin>
          <LocalePhrase id="pages.clubcard-address.edit.title" />
        </PageTitleStyled>
        <Banner {...banner} />
        <Panel>
          <Formik
            initialValues={initialValues}
            initialErrors={errors}
            validationJSONSchema={schema}
            onSubmit={handleSubmit}
          >
            <Form
              onError={handleError}
              fields={fields}
              csrf={csrf}
              submitText={getLocalePhrase('pages.clubcard-address.edit.submit-button')}
            />
          </Formik>
        </Panel>
      </React.Fragment>
    </DocumentTitle>
  );
};

ClubcardAddressPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
  }),
};
export default connectPage(({ location }) => ({
  url: `${location.pathname}${location.search}`,
}))(ClubcardAddressPage);
