import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@beans/appbar';
import Masthead from '@beans/masthead';
import MainMenu from '@beans/primary-navigation';
import { HeaderContainer, HeaderStyled } from './styled';
import { connectApp } from '@oneaccount/react-foundations';

class Header extends React.PureComponent {
  static propTypes = {
    appConfig: PropTypes.shape({
      config: PropTypes.object.isRequired,
      region: PropTypes.string.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      getLocalePhrase: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { selectedMenuItemID: undefined };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getMobileMenuItem = this.getMobileMenuItem.bind(this);
  }

  handleOnChange({ selectedMenu, selectedMenuItemID }) {
    this.setState({ selectedMenu, selectedMenuItemID });
  }

  getMenuLinks() {
    const { config, region, getLocalePhrase, isAuthenticated } = this.props.appConfig;
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

  getMobileMenuItem() {
    const { config, region, getLocalePhrase } = this.props.appConfig;
    const { mobileMenuItem } = config[region].header;

    return {
      ...mobileMenuItem,
      text: getLocalePhrase(mobileMenuItem.text),
    };
  }

  render() {
    const { config, region } = this.props.appConfig;
    const menuLinks = this.getMenuLinks();

    return (
      <HeaderContainer>
        <HeaderStyled
          fixedFrom="md"
          onChange={this.handleOnChange}
          selectedMenuItemID={this.state.selectedMenuItemID}
          selectedMenu={this.state.selectedMenu}
          appbar={<AppBar menu={menuLinks} />}
          masthead={<Masthead branding={config[region].header.branding} />}
          primaryNavigation={
            <MainMenu
              mobileMenuItem={this.getMobileMenuItem()}
              utilityMenuItems={menuLinks}
              selectedMenuItemID={config[region].header.selectedMenuItemID}
            />
          }
        />
      </HeaderContainer>
    );
  }
}

export default connectApp(Header);
