import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../common/styled-components';
import DocumentTitle from 'react-document-title';
import { PageTitle, BodyText } from '@beans/typography';
import { useAppConfig } from '@oneaccount/react-foundations';

const LOCALE_ROOT = 'pages.not-found';

export function NotFoundPage() {
  const { getLocalePhrase, config, region } = useAppConfig();
  const { tescoHomepage } = config[region].externalApps;

  return (
    <DocumentTitle title={getLocalePhrase(`${LOCALE_ROOT}.title`)}>
      <div>
        <PageTitle margin>{getLocalePhrase(`${LOCALE_ROOT}.heading`)}</PageTitle>
        <BodyText margin>{getLocalePhrase(`${LOCALE_ROOT}.paragraphs.0`)}</BodyText>
        <BodyText margin>{getLocalePhrase(`${LOCALE_ROOT}.paragraphs.1`)}</BodyText>
        <Link variant="textButton" href={tescoHomepage}>
          {getLocalePhrase(`${LOCALE_ROOT}.home`)}
        </Link>
      </div>
    </DocumentTitle>
  );
}

NotFoundPage.contextTypes = {
  theme: PropTypes.object,
};

export default NotFoundPage;
