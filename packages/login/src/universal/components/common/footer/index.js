import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BeansFooter from '@beans/footer';

const CLOSE = 'close';
const ALL = 'all';

export class Footer extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    region: PropTypes.string.isRequired,
    getLocalePhrase: PropTypes.func.isRequired,
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

  shouldComponentUpdate() {
    return true;
  }

  handleAccordionOnChange({ action, id }) {
    this.setState({ activeAccordion: { action, id } });
  }

  renderCopyright() {
    const { getLocalePhrase } = this.props;
    const copyright = getLocalePhrase('footer.copyright', {
      year: new Date().getFullYear(),
    });

    return `${getLocalePhrase('tesco-site')} ${copyright}`;
  }

  getFooterLinks() {
    const { config, region, getLocalePhrase } = this.props;

    return config[region].footerLinks.map((section, i) => ({
      header: getLocalePhrase(`footer.links.header${i+1}.title`),
      links: section.links.map((link, j) => ({
        ...link,
        text: getLocalePhrase(`footer.links.header${i+1}.link${j+1}`),
      }))
    }));
  }

  render() {
    const { config, region } = this.props;

    return (
      <BeansFooter
        accordion={this.state.activeAccordion}
        contentLinks={this.getFooterLinks()}
        onChange={this.handleAccordionOnChange}
        socialLinks={config[region].socialLinks}
        followUsText={this.props.getLocalePhrase('footer.social-bar.label')}
        copyrightText={this.renderCopyright()}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
    region: state.region,
    getLocalePhrase: state.getLocalePhrase,
  };
}

export default connect(mapStateToProps)(Footer);
