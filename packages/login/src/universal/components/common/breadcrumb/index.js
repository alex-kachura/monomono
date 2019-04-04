import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BreadcrumbContainer from '@beans/breadcrumb';
import { BreadcrumbBarview } from './styled';
import AltLink from '../alt-link';

export function Breadcrumb({ config, links, region }) {
  return links && links.length > 0 ? (
    <BreadcrumbBarview>
      <BreadcrumbContainer
        home={{
          href: config[region].externalApps.tescoHomepage,
        }}
        links={links}
        altLink={AltLink}
      />
    </BreadcrumbBarview>
  ) : null;
}

/* eslint-disable react/no-unused-prop-types */
Breadcrumb.propTypes = {
  links: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  region: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
};
/* eslint-enable react/no-unused-prop-types */

function mapStateToProps(state) {
  const payload = state.payload;

  return {
    links: payload.breadcrumb,
    region: state.region,
    config: state.config,
    getLocalePhrase: state.getLocalePhrase,
  };
}

export default connect(mapStateToProps)(Breadcrumb);
