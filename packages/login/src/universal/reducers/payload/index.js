import { fromJS } from 'immutable';
import * as types from '../../actions';
import formReducer from '../form';

const initialState = fromJS({
  breadcrumb: [],
});

export default function payloadReducer(state = initialState, action) {
  switch (action.type) {
    case types.DATA_ARRIVED:
      return fromJS({ // Taking this approach as Immutable.mergeDeep is not available in the stable build
        ...state.toJS(),
        ...action.payload,
      });
    default:
      return fromJS({
        ...state.toJS(),
        form: formReducer(state.get('form'), action),
      });
  }
}
