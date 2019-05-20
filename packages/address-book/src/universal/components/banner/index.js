import React from 'react';
import PropTypes from 'prop-types';
import { Signpost, BodyText } from '@beans/typography';
import Icon from '@beans/icon';
import { BannerContainer, BannerIconHolder, BannerContent } from './styled';

export default function Banner({ details }) {
  const { bannerType, title, description } = details;
  let iconType;
  let iconColor;
  let bannerColor;

  switch (bannerType) {
    case 'success':
      iconType = 'success';
      iconColor = '#008800';
      bannerColor = '#e0f0e0';
      break;
    case 'error':
      iconType = 'error';
      iconColor = '#cc3333';
      bannerColor = '#fbefef';
      break;
    case 'info':
      iconType = 'info';
      iconColor = '#007eb3';
      bannerColor = '#e0eff5';
      break;
    default:
      break;
  }

  if (!iconType) {
    return null;
  }

  return (
    <BannerContainer style={{ backgroundColor: bannerColor }}>
      <BannerIconHolder>
        <Icon background={iconColor} graphic={iconType} inverse />
      </BannerIconHolder>
      <BannerContent>
        <Signpost>{title}</Signpost>
        {description && <BodyText dangerouslySetInnerHTML={{ __html: description }} />}
      </BannerContent>
    </BannerContainer>
  );
}

Banner.propTypes = {
  details: PropTypes.object.isRequired,
};
