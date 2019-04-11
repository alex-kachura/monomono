import React from 'react';
import { Heading, Signpost, BodyText } from '@beans/typography';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';
import { SectionStyled } from '../styled';
import Clubcard from './svg/clubcard';
import CreditCard from './svg/credit-card';

export function ClubcardInfo() {
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
        <BodyText margin>
          {getLocalePhrase('pages.verify.clubcard-info.copy-1')}
        </BodyText>
        <Clubcard />
      </section>
      <section>
        <Signpost as="h3" margin>
          {getLocalePhrase('pages.verify.clubcard-info.sub-heading-2')}
        </Signpost>
        <BodyText margin>
          {getLocalePhrase('pages.verify.clubcard-info.copy-2')}
        </BodyText>
        <CreditCard />
      </section>
    </SectionStyled>
  );
}

export default connectPage({ noData: true })(ClubcardInfo);
