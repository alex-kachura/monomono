import React from 'react';
import PropTypes from 'prop-types';
import Notification from '@beans/notification';
import { Container } from './styled';

export default function Banner({ type, title, text }) {
  return type ? (
    <Container>
      <Notification
        title={title}
        variant={type}
      >
        {text}
      </Notification>
    </Container>
  ) : null;
}

Banner.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
};
