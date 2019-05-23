/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Form from '../common/form';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';

const AddDeliveryAddressPage = ({
  initialData: { banner: initialBanner = {}, values: initialValues = {}, fields, errors, schema },
  location,
  history,
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();

  const handleSubmit = useCallback(() => {
    history.replace(`${rootPath}?action=added`);
  }, []);

  return (
    <DocumentTitle title={getLocalePhrase('pages.delivery-address.add.title')}>
      <Form
        url={`${location.pathname}${location.search}`}
        title={getLocalePhrase('pages.delivery-address.add.title')}
        initialBanner={initialBanner}
        initialValues={initialValues}
        initialErrors={errors}
        schema={schema}
        fields={fields}
        submitText={getLocalePhrase('pages.delivery-address.add.submit-button')}
        onSubmit={handleSubmit}
      />
    </DocumentTitle>
  );
};

AddDeliveryAddressPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  appConfig: PropTypes.shape({
    csrf: PropTypes.string.isRequired,
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
    fields: PropTypes.array,
  }),
};

export default connectPage(({ location }) => ({
  url: location.pathname,
}))(AddDeliveryAddressPage);
