import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

export function VerifyPage({  getLocalePhrase }) {
  const pageTitle = getLocalePhrase('pages.landing.title');

  return (
    <DocumentTitle title={pageTitle}>
      <div>
        Verify
      </div>
    </DocumentTitle>
  );
}

VerifyPage.propTypes = {
  getLocalePhrase: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    getLocalePhrase: state.get('getLocalePhrase'),
  };
}

export default connect(mapStateToProps)(VerifyPage);
