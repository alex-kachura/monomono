import React from 'react';
import PropTypes from 'prop-types';

import Link from '@beans/link';
import { useAppConfig } from '@oneaccount/react-foundations';
import AltLink from '../../../common/alt-link';

export default function EditButton({ itemId, isMCA }) {
  const { rootPath, getLocalePhrase } = useAppConfig();
  const editLink = isMCA
    ? `${rootPath}/edit-clubcard-address?id=${itemId}`
    : `${rootPath}/edit-delivery-address?id=${itemId}`;

  return (
    <Link emphasized variant="standalone" href={editLink} altLink={AltLink}>
      {getLocalePhrase('pages.landing.edit-btn')}
    </Link>
  );
}

EditButton.propTypes = {
  itemId: PropTypes.string.isRequired,
  isMCA: PropTypes.bool,
};
