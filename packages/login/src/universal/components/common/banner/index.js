import React from 'react';
import PropTypes from 'prop-types';
import Notification from '@beans/notification';
import { BodyText } from '@beans/typography';
import { Container } from './styled';

export default function Banner({ type, title, text }) {
  return type ? (
    <Container>
      <Notification title={title} variant={type} className="notification-banner">
        <BodyText>{text}</BodyText>
      </Notification>
    </Container>
  ) : null;
}

Banner.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
};
