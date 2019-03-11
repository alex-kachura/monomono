import { LOCATION_CHANGE } from 'connected-react-router';
import { getData } from '../../thunks/get-data';

// We skip the first fetch of data as this happens on page load
// when we already have the data from the server render.
let skipFirst = true;

export default (store) => (next) => (action) => {
  // For any client-side routing changes, retrieve data from server
  if (action.type === LOCATION_CHANGE && !skipFirst) {
    // Get data for the route that we're routing to
    store.dispatch(getData(action.payload.location.pathname));
  }

  skipFirst = false;

  return next(action);
};
