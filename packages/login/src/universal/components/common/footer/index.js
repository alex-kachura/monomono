import React from 'react';
import PropTypes from 'prop-types';
import BeansFooter from '@beans/footer';
import { connectApp } from '@oneaccount/react-foundations';

const CLOSE = 'close';
const ALL = 'all';

export class Footer extends React.PureComponent {
  static propTypes = {
    appConfig: PropTypes.shape({
      config: PropTypes.object.isRequired,
      region: PropTypes.string.isRequired,
      getLocalePhrase: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeAccordion: { action: CLOSE, id: ALL },
    };

    this.handleAccordionOnChange = this.handleAccordionOnChange.bind(this);
    this.renderCopyright = this.renderCopyright.bind(this);
    this.getFooterLinks = this.getFooterLinks.bind(this);
  }

  handleAccordionOnChange({ action, id }) {
    this.setState({ activeAccordion: { action, id } });
  }

  renderCopyright() {
    const { getLocalePhrase } = this.props.appConfig;
    const copyright = getLocalePhrase('footer.copyright', {
      year: new Date().getFullYear(),
    });

    return `${getLocalePhrase('tesco-site')} ${copyright}`;
  }

  getFooterLinks() {
    const { config, region, getLocalePhrase } = this.props.appConfig;

    return config[region].footerLinks.map((section, i) => ({
      header: getLocalePhrase(`footer.links.header${i + 1}.title`),
      links: section.links.map((link, j) => ({
        ...link,
        text: getLocalePhrase(`footer.links.header${i + 1}.link${j + 1}`),
      })),
    }));
  }

  render() {
    const { config, region, getLocalePhrase } = this.props.appConfig;

    return (
      <BeansFooter
        accordion={this.state.activeAccordion}
        contentLinks={this.getFooterLinks()}
        onChange={this.handleAccordionOnChange}
        socialLinks={config[region].socialLinks}
        followUsText={getLocalePhrase('footer.social-bar.label')}
        copyrightText={this.renderCopyright()}
      />
    );
  }
}

// const footerSelector = createSelector(
//   (state) => state.get('config'),
//   (state) => state.get('region'),
//   (state) => state.get('getLocalePhrase'),
//   (config, region, getLocalePhrase) => ({
//     config: config.toJS(),
//     region,
//     getLocalePhrase,
//   }),
// );

export default connectApp(Footer);
