import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { PageTitle } from '@beans/typography';
import { Link } from '../common/styled-components';
import AltLink from '../common/alt-link';

export function LandingPage({ rootPath, getLocalePhrase }) {
  const pageTitle = getLocalePhrase('pages.landing.title');

  return (
    <DocumentTitle title={pageTitle}>
      <div>
        <PageTitle margin>{pageTitle}</PageTitle>
        <Link altLink={AltLink} href={`${rootPath}/edit`} variant="textButton">
          {getLocalePhrase('pages.landing.sample-form-btn')}
        </Link>
      </div>
    </DocumentTitle>
  );
}

LandingPage.propTypes = {
  rootPath: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    rootPath: state.get('rootPath'),
    getLocalePhrase: state.get('getLocalePhrase'),
  };
}

export default connect(mapStateToProps)(LandingPage);
