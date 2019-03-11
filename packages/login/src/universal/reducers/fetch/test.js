import { fromJS } from 'immutable';
import reducer from './';
import * as types from '../../actions';

/* eslint-disable accessor-pairs */

describe('Fetch reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS({ waiting: false }));
  });

  it('should handle DATA_LOADING', () => {
    expect(reducer({}, { type: types.DATA_LOADING })).toEqual(fromJS({ waiting: true }));
  });

  it('should handle DATA_ARRIVED', () => {
    expect(reducer({}, { type: types.DATA_ARRIVED })).toEqual(fromJS({ waiting: false }));
  });
});
