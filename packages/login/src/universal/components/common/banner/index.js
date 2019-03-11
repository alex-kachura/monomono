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

export default function Banner({ bannerType, title, text, children }) {
  return bannerType ? (
    <Container>
      <Notification title={title} variant={bannerType}>
        {renderBody(children, text)}
      </Notification>
    </Container>
  ) : null;
}

Banner.propTypes = {
  bannerType: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
};
