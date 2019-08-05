import React from 'react';
import { Heading, BodyText } from '@beans/typography';
import { useAppConfig } from '@oneaccount/react-foundations';
import { SectionStyled } from '../styled';
import { LinkStyled } from './styled';

export function OrderClubcard() {
  const { getLocalePhrase, config, region, lang } = useAppConfig();
  const orderClubcardUrl = `${config[region].externalApps.tescoSecure}/account/${lang}/manage/order-clubcard`;

  return (
    <SectionStyled>
      <Heading as="h2" margin>
        {getLocalePhrase('pages.verify.order-clubcard.heading')}
      </Heading>
      <BodyText margin>{getLocalePhrase('pages.verify.order-clubcard.copy')}</BodyText>
      <LinkStyled
        buttonVariant="secondary"
        href={orderClubcardUrl}
        variant="textButton"
        data-tracking="order a new one"
      >
        {getLocalePhrase('pages.verify.order-clubcard.button')}
      </LinkStyled>
    </SectionStyled>
  );
}

export default OrderClubcard;
