import '../public/styles/opinionlab.css';

import 'babel-polyfill';
import Polyglot from 'node-polyglot';
import Immutable from 'immutable';
import { createBrowserHistory } from 'history';
import dataFetchMiddleware from '../universal/middleware/fetch-data';
import handleAuthMiddleware from '../universal/middleware/handle-unauthenticated';
import analyticsMiddleware from '../universal/middleware/analytics';
import { configureStore } from '../universal/store';
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

const state = Immutable.fromJS({
  ...initialState,
  getLocalePhrase: (key, variables) => dictionary.t(key, variables),
});

const history = createBrowserHistory();
const store = configureStore(state, history, dataFetchMiddleware, handleAuthMiddleware, analyticsMiddleware);

const routes = routesFactory(config, lang);

renderClient(store, routes, history);
