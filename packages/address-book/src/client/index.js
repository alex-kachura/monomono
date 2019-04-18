import '../public/styles/opinionlab.css';

import 'babel-polyfill';
import Polyglot from 'node-polyglot';
import { renderClient } from '../renderer';
import routesFactory from '../universal/routes';

const initialState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const config = JSON.parse(document.getElementById('config').innerHTML);
const lang = document.documentElement.getAttribute('data-lang');
const phrases = JSON.parse(document.getElementById('dictionary').innerHTML);

const dictionary = new Polyglot({
  phrases,
  locale: lang,
});

const routes = routesFactory(config, lang);

renderClient(
  {
    ...initialState,
    getLocalePhrase: (key, variables) => dictionary.t(key, variables),
  },
  routes,
);
