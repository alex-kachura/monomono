import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import fetch from './fetch';
import payload from './payload';

function defaultReducerFactory(defaultState) {
  return (state = defaultState) => state;
}

const reducers = combineReducers({
  payload,
  fetch,
  isAuthenticated: defaultReducerFactory(false),
  host: defaultReducerFactory(''),
  rootPath: defaultReducerFactory(''),
  referrer: defaultReducerFactory(fromJS({})),
  config: defaultReducerFactory({}),
  lang: defaultReducerFactory(''),
  region: defaultReducerFactory(''),
  getLocalePhrase: defaultReducerFactory(Function.prototype),
  csrf: defaultReducerFactory(''),
});

export default reducers;
