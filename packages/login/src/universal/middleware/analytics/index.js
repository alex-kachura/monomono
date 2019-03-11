import { LOCATION_CHANGE } from 'connected-react-router';
import { trackEvent, getPageName } from '../../../utils/analytics';

let skipFirst = true;

const events = {
  pageName: 'login',
};
const props = {
  pageName: 'page_name',
};

export default () => (next) => (action) => {
  const { payload } = action;

  // Track new page loaded for any client-side routing
  // (except the route triggered on page load)
  if (action.type === LOCATION_CHANGE && !skipFirst) {
    trackEvent(events.pageName, props.pageName, getPageName(payload.location.pathname));
  }

  skipFirst = false;

  return next(action);
};
