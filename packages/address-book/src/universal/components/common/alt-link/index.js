import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function AltLink({ children, href, 'data-tracking': dataTracking }) {
  // TODO: filter props to only dom attributes
  return (
    <Link to={href} data-tracking={dataTracking}>
      {children}
    </Link>
  );
}

AltLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
  'data-tracking': PropTypes.string.isRequired,
};
