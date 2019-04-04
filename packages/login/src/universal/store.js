import rootReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export function configureStore(initialState, history, ...middleware) {
  return createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunkMiddleware, ...middleware)),
  );
}
