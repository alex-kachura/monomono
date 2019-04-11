import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function AltLink({ children, href }) {
  return <Link to={href}>{children}</Link>;
}

AltLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
};
