import React, { memo } from 'react';
import BreadcrumbContainer from '@beans/breadcrumb';
import { BreadcrumbBarview } from './styled';
import AltLink from '../alt-link';
import { useBreadcrumb, useAppConfig } from '@oneaccount/react-foundations';

export function Breadcrumb() {
  const { config, region } = useAppConfig();
  const { breadcrumb } = useBreadcrumb();

  if (!breadcrumb || breadcrumb.length === 0) {
    return null;
  }

  return breadcrumb && breadcrumb.length > 0 ? (
    <BreadcrumbBarview>
      <BreadcrumbContainer
        backToText={'Back to'}
        home={{
          href: config[region].externalApps.tescoHomepage,
        }}
        links={breadcrumb}
        altLink={AltLink}
      />
    </BreadcrumbBarview>
  ) : null;
}

export default memo(Breadcrumb);
