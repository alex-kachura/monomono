import { DATA_ARRIVED } from '../../actions';

export default () => (next) => (action) => {
  if (action.type === DATA_ARRIVED && action.response && action.response.status === 401) {
    window.location = action.response.location;
  }

  return next(action);
};
