import React from 'react';
import { Heading, Signpost } from '@beans/typography';
import { useAppConfig } from '@oneaccount/react-foundations';
import { SectionStyled, TextStyled } from '../styled';
import Clubcard from './svg/clubcard';
import CreditCard from './svg/credit-card';

export default function ClubcardInfo() {
  const { getLocalePhrase } = useAppConfig();

  return (
    <SectionStyled>
      <Heading as="h2" margin>
        {getLocalePhrase('pages.verify.clubcard-info.heading')}
      </Heading>
      <section>
        <Signpost as="h3" margin>
          {getLocalePhrase('pages.verify.clubcard-info.sub-heading-1')}
        </Signpost>
        <TextStyled>
          {getLocalePhrase('pages.verify.clubcard-info.copy-1')}
        </TextStyled>
        <Clubcard />
      </section>
      <section>
        <Signpost as="h3" margin>
          {getLocalePhrase('pages.verify.clubcard-info.sub-heading-2')}
        </Signpost>
        <TextStyled>
          {getLocalePhrase('pages.verify.clubcard-info.copy-2')}
        </TextStyled>
        <CreditCard />
      </section>
    </SectionStyled>
  );
}
