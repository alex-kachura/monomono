import React from 'react';
import PropTypes from 'prop-types';
import { Column } from '@beans/grid';
import EditButton from '../buttons/edit';
import DeleteButton from '../buttons/delete';
import { AdditionalPanelStyled, SeparatingLine, AdditionalButtons } from './styled';

export function AdditionalPanel({ address, panelButton, children }) {
  return (
    <Column size={24} sm={8}>
      <AdditionalPanelStyled panelButton={!!panelButton}>
        {children}
        {!panelButton && (
          <AdditionalButtons>
            <EditButton itemId={address.addressIndex} />
            <SeparatingLine />
            <DeleteButton
              itemId={address.addressIndex}
              label={address.label}
              firstLine={address.addressLines[0].value}
            />
          </AdditionalButtons>
        )}
      </AdditionalPanelStyled>
    </Column>
  );
}

AdditionalPanel.propTypes = {
  address: PropTypes.object,
  panelButton: PropTypes.bool,
  children: PropTypes.node,
};
