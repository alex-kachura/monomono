import React from 'react';
import PropTypes from 'prop-types';

import Link from '@beans/link';
import { useAppConfig } from '@oneaccount/react-foundations';
import AltLink from '../../../common/alt-link';
import { Analytics } from '../../../../../utils/analytics';

export default function EditButton({
  itemId,
  isMCA,
  'data-tracking': dataTracking = Analytics.Landing.Events.EDIT_DELIVERY_ADDRESS,
}) {
  const { rootPath, getLocalePhrase } = useAppConfig();

  const editLink = isMCA
    ? `${rootPath}/edit-clubcard-address?id=${itemId}`
    : `${rootPath}/edit-delivery-address?id=${itemId}`;

  const elementClass = `edit-address-link${isMCA ? '-clubcard' : '-grocery'}`;

  return (
    <Link
      className={elementClass}
      emphasized
      variant="standalone"
      href={editLink}
      altLink={AltLink}
      data-tracking={dataTracking}
    >
      {getLocalePhrase('pages.landing.edit-btn')}
    </Link>
  );
}

EditButton.propTypes = {
  'data-tracking': PropTypes.string,
  itemId: PropTypes.string.isRequired,
  isMCA: PropTypes.bool,
};
