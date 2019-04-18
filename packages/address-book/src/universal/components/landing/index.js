import React, { memo } from 'react';
import DocumentTitle from 'react-document-title';
import { PageTitle } from '@beans/typography';
import { Link } from '../common/styled-components';
import AltLink from '../common/alt-link';
import { useAppConfig, connectPage } from '@oneaccount/react-foundations';

export function LandingPage() {
  const { rootPath, getLocalePhrase } = useAppConfig();
  const pageTitle = getLocalePhrase('pages.landing.title');

  return (
    <DocumentTitle title={pageTitle}>
      <React.Fragment>
        <PageTitle margin>{pageTitle}</PageTitle>
        <Link altLink={AltLink} href={`${rootPath}/edit`} variant="textButton">
          {getLocalePhrase('pages.landing.sample-form-btn')}
        </Link>
      </React.Fragment>
    </DocumentTitle>
  );
}

export default connectPage({
  url: '/account/address-book/en-GB',
})(memo(LandingPage));
