import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '../common/styled-components';
import DocumentTitle from 'react-document-title';
import { PageTitle, BodyText } from '@beans/typography';

const LOCALE_ROOT = 'pages.not-found';

export function NotFoundPage({ config, region, getLocalePhrase }) {
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

NotFoundPage.propTypes = {
  config: PropTypes.object.isRequired,
  region: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    config: state.get('config').toJS(),
    region: state.get('region'),
    getLocalePhrase: state.get('getLocalePhrase'),
  };
}

export default connect(mapStateToProps)(NotFoundPage);
