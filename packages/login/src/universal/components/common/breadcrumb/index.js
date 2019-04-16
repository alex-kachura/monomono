import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbContainer from '@beans/breadcrumb';
import { BreadcrumbBarview } from './styled';
import AltLink from '../alt-link';
import { useAppConfig, BreadcrumbContext } from '@oneaccount/react-foundations';

export function Breadcrumb() {
  const { config, region } = useAppConfig();
  const { breadcrumb } = useContext(BreadcrumbContext);

  return breadcrumb && breadcrumb.length > 0 ? (
    <BreadcrumbBarview>
      <BreadcrumbContainer
        home={{
          href: config[region].externalApps.tescoHomepage,
        }}
        links={breadcrumb}
        altLink={AltLink}
      />
    </BreadcrumbBarview>
  ) : null;
}

Breadcrumb.propTypes = {
  appConfig: PropTypes.shape({
    config: PropTypes.object.isRequired,
    region: PropTypes.string.isRequired,
  }),
};

export default Breadcrumb;
