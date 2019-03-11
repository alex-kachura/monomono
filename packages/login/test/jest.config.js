import PropTypes from 'prop-types';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import ThemeProvider from '@ddl/react-theme-provider';

configure({ adapter: new Adapter() });

global.mount = mount;
global.shallow = shallow;
global.render = render;
global.fetch = require('jest-fetch-mock');

// const defaultTheme = ThemeProvider.defaultProps.theme;
// const defaultContext = {
//   theme: defaultTheme,
// };

const defaultChildContextTypes = {
  theme: PropTypes.object,
  getLocalePhrase: PropTypes.func,
};

global.contextualShallow = function contextualShallow(component, opts = {}) {
  opts.context = Object.assign({}, opts.context || {});
  opts.childContextTypes = defaultChildContextTypes;

  return shallow(component, opts);
};

global.contextualMount = function contextualMount(component, opts = {}) {
  opts.context = Object.assign({}, opts.context || {});
  opts.childContextTypes = defaultChildContextTypes;

  return mount(component, opts);
};
