import React from 'react';
import PropTypes from 'prop-types';
import { Container, SpinnerIcon } from './styled';

export default function Spinner({ mobileStyles, desktopStyles }) {
  return (
    <Container>
      <SpinnerIcon mobileStyles={mobileStyles} desktopStyles={desktopStyles} />
    </Container>
  );
}

Spinner.propTypes = {
  mobileStyles: PropTypes.string,
  desktopStyles: PropTypes.string,
};
