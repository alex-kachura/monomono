/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Form from '../common/form';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';

const EditDeliveryAddressPage = ({
  history,
  location,
  initialData: { banner: initialBanner = {}, values: initialValues, fields, errors, schema },
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();

  const handleSubmit = useCallback(() => {
    history.replace(`${rootPath}?action=updated`);
  }, []);

  return (
    <DocumentTitle title={getLocalePhrase('pages.delivery-address.edit.title')}>
      <Form
        url={`${location.pathname}${location.search}`}
        title={getLocalePhrase('pages.delivery-address.edit.title')}
        initialBanner={initialBanner}
        initialValues={initialValues}
        initialErrors={errors}
        schema={schema}
        fields={fields}
        submitText={getLocalePhrase('pages.delivery-address.edit.submit-button')}
        onSubmit={handleSubmit}
      />
    </DocumentTitle>
  );
};

EditDeliveryAddressPage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  appConfig: PropTypes.shape({
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
  }),
};

export default connectPage(({ location }) => ({
  url: `${location.pathname}${location.search}`,
}))(EditDeliveryAddressPage);
