import React from 'react';
import { useAppConfig } from '@oneaccount/react-foundations';
import {
  SectionStyled,
  TitleHidden,
  PhoneNumbers,
  FootNote,
  Reference1,
  Reference2,
  NumberLink,
} from './styled';

function useHelpers() {
  const { getLocalePhrase } = useAppConfig();

  const getNumberLink = (key) => {
    const number = getLocalePhrase(key);
    const trimmed = number.replace(/ /g, '');

    return (
      <NumberLink href={`tel:${trimmed}`}>{number}</NumberLink>
    );
  };

  return { getLocalePhrase, getNumberLink };
}

export function ContactInfo() {
  const { getLocalePhrase, getNumberLink } = useHelpers();

  return (
    <SectionStyled>
      <TitleHidden>
        {getLocalePhrase('pages.verify.contact-info.heading')}
      </TitleHidden>
      <PhoneNumbers>
        {getLocalePhrase('pages.verify.contact-info.contact-us.part-1')}
        {getNumberLink('pages.verify.contact-info.phone-number-1')}
        {getLocalePhrase('pages.verify.contact-info.contact-us.part-2')}
        {getNumberLink('pages.verify.contact-info.phone-number-2')}
        {getLocalePhrase('pages.verify.contact-info.contact-us.part-3')}
      </PhoneNumbers>
      <FootNote>
        <Reference1>
          {getLocalePhrase('pages.verify.contact-info.calls-info1')}
        </Reference1>
        <Reference2>
          {getLocalePhrase('pages.verify.contact-info.calls-info2')}
        </Reference2>
      </FootNote>
    </SectionStyled>
  );
}

export default ContactInfo;
