import React from 'react';
import PropTypes from 'prop-types';
import { AddAddressLink, LinkSubHeading, AddLinkInner } from './styled';
import { Link } from 'react-router-dom';

function AddBtnAltLink({ children, href }) {
  return (
    <Link to={href}>
      <AddLinkInner>{children}</AddLinkInner>
    </Link>
  );
}

AddBtnAltLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
};

export default function AddAddress({ rootPath }) {
  const addAddressLink = `${rootPath}/add-delivery-address`;

  return (
    <AddAddressLink
      id="add-delivery-address"
      buttonVariant="secondary"
      href={addAddressLink}
      icon={{
        graphic: 'add',
        position: {
          global: 'left',
        },
      }}
      variant="iconButton"
      altLink={AddBtnAltLink}
    >
      <LinkSubHeading>{'Add delivery address'}</LinkSubHeading>
    </AddAddressLink>
  );
}

AddAddress.propTypes = {
  rootPath: PropTypes.string.isRequired,
};
