import { fromJS, Map } from 'immutable';
import * as types from '../../actions';

// Initial commit initial state at the moment is set to an empty object.
export default function fetchReducer(state = new Map({ waiting: false }), action) {
  switch (action.type) {
    case types.DATA_LOADING:
      return fromJS({
        waiting: true,
      });
    case types.DATA_ARRIVED:
      return fromJS({
        waiting: false,
      });
    default:
      return state;
  }
}
