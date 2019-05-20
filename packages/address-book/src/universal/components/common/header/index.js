import React, { memo, useMemo, useState } from 'react';
import AppBar from '@beans/appbar';
import Masthead from '@beans/masthead';
import MainMenu from '@beans/primary-navigation';
import { HeaderContainer, HeaderStyled } from './styled';
import { useAppConfig } from '@oneaccount/react-foundations';

function getMenuLinks({ config, region, getLocalePhrase, isAuthenticated }) {
  const loginUrl = config[region].externalApps.login;
  const links = config[region].header.menu.map((link) => ({
    ...link,
    text: getLocalePhrase(`header.menu.${link.text}`),
  }));

  // Only render a sign in/out link if a login page exists for this region
  if (loginUrl) {
    const loginOutKey = isAuthenticated ? 'sign-out' : 'sign-in';
    const logoutUrl = config[region].externalApps.logout;

    links.push({
      id: loginOutKey,
      href: isAuthenticated ? logoutUrl : loginUrl,
      text: getLocalePhrase(loginOutKey),
      'data-tracking': loginOutKey,
    });
  }

  return links;
}

function getMobileMenuItem({ config, region, getLocalePhrase }) {
  const { mobileMenuItem } = config[region].header;

  return {
    ...mobileMenuItem,
    text: getLocalePhrase(mobileMenuItem.text),
  };
}

function Header() {
  const { config, region, getLocalePhrase, isAuthenticated } = useAppConfig();
  const [state, handleChange] = useState({
    selectedMenu: undefined,
    selectedMenuItemID: undefined,
  });
  const menuLinks = useMemo(
    () => getMenuLinks({ config, region, getLocalePhrase, isAuthenticated }),
    [],
  );

  const mobileMenuItem = useMemo(() => getMobileMenuItem({ config, region, getLocalePhrase }), []);

  return (
    <HeaderContainer>
      <HeaderStyled
        fixedFrom="xl"
        onChange={handleChange}
        selectedMenuItemID={state.selectedMenuItemID}
        selectedMenu={state.selectedMenu}
        appbar={<AppBar menu={menuLinks} />}
        masthead={<Masthead branding={config[region].header.branding} />}
        primaryNavigation={
          <MainMenu
            mobileMenuItem={mobileMenuItem}
            utilityMenuItems={menuLinks}
            selectedMenuItemID={config[region].header.selectedMenuItemID}
          />
        }
      />
    </HeaderContainer>
  );
}

export default memo(Header);
