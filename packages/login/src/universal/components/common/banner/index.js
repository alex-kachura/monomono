import React from 'react';
import PropTypes from 'prop-types';
import { BodyText } from '@beans/typography';
import Notification from '@beans/notification';
import { Container } from './styled';

function renderBody(children, text) {
  if (children) {
    return <BodyText>{children}</BodyText>;
  } else if (text) {
    return (
      <BodyText
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    );
  }

  return null;
}

export default function Banner({ type, title, text, children }) {
  return type ? (
    <Container>
      <Notification
        title={title}
        variant={type}
      >
        {renderBody(children, text)}
      </Notification>
    </Container>
  ) : null;
}

Banner.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
};
