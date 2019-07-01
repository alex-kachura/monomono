/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Form from '../common/form';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';

const ClubcardAddressPage = ({
  history,
  location,
  initialData: {
    banner: initialBanner,
    values: initialValues,
    fields,
    errors: initialErrors,
    schema,
  },
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();

  const handleSubmit = useCallback(() => {
    history.replace(`${rootPath}?action=clubcard-updated`);
  }, []);

  const handleErrors = useCallback(() => {
    /**
     * Do analytics stuff
     */
  }, []);

  return (
    <DocumentTitle title={getLocalePhrase('pages.clubcard-address.edit.title')}>
      <Form
        url={`${location.pathname}${location.search}`}
        title={getLocalePhrase('pages.clubcard-address.edit.title')}
        initialBanner={initialBanner}
        initialValues={initialValues}
        initialErrors={initialErrors}
        schema={schema}
        fields={fields}
        submitText={getLocalePhrase('pages.clubcard-address.edit.submit-button')}
        onSubmit={handleSubmit}
        onErrors={handleErrors}
      />
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
