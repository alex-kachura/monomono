import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@beans/button';
import { useAppConfig } from '@oneaccount/react-foundations';
import {
  Content,
  ButtonStyled,
  EllipsisBodyText,
  ConfirmationSheet,
  WrapTextSubHeading,
  BoldWrapBodyText,
} from './styled';

export default function DeleteButton({ itemId, label, firstLine }) {
  const { rootPath, getLocalePhrase, csrf } = useAppConfig();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteUrl = `${rootPath}/`;

  const didToggleShowConfirmation = useCallback(
    () => {
      setShowConfirmation(!showConfirmation);
    },
    [showConfirmation],
  );

  function handleFormSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  const confirmationStyle = showConfirmation
    ? {
        transform: 'translate3d(0, 0, 0)',
        opacity: 1,
      }
    : {
        transform: 'translate3d(0, 100%, 0)',
        opacity: 0,
      };

  return (
    <React.Fragment>
      <form action={deleteUrl} method="POST" onSubmit={handleFormSubmit}>
        <input type="hidden" name="contact-address-id" value={itemId} />
        <Button
          className="delete-address"
          variant="link"
          type="submit"
          onClick={didToggleShowConfirmation}
        >
          {getLocalePhrase('pages.landing.delete-btn')}
        </Button>
        <input type="hidden" name="_csrf" value={csrf} />
      </form>
      <ConfirmationSheet style={confirmationStyle}>
        <WrapTextSubHeading>
          {getLocalePhrase('pages.landing.delete.confirmation-message')}
        </WrapTextSubHeading>
        <Content>
          <BoldWrapBodyText className='nickname'>{label}</BoldWrapBodyText>
          <EllipsisBodyText className='address-line-0'>{firstLine}</EllipsisBodyText>
        </Content>
        <form action={deleteUrl} method="POST">
          <input type="hidden" name="contact-address-id" value={itemId} />
          <ButtonStyled className="delete-address-confirm" variant="primary" type="submit">
            {getLocalePhrase('pages.landing.delete.confirm')}
          </ButtonStyled>
          <input type="hidden" name="_csrf" value={csrf} />
        </form>
        <Button
          className="delete-address-cancel"
          variant="secondary"
          onClick={didToggleShowConfirmation}
        >
          {getLocalePhrase('pages.landing.delete.cancel')}
        </Button>
      </ConfirmationSheet>
    </React.Fragment>
  );
}

DeleteButton.propTypes = {
  itemId: PropTypes.string.isRequired,
  label: PropTypes.string,
  firstLine: PropTypes.string.isRequired,
};
