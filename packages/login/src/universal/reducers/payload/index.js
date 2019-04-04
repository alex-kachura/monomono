import * as types from '../../actions';

const initialState = {
  breadcrumb: [],
};

export default function payloadReducer(state = initialState, action) {
  switch (action.type) {
    case types.DATA_ARRIVED:
      return action.payload;
    default:
      return state;
  }
}
