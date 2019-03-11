import { fromJS } from 'immutable';
import * as types from '../../actions';

describe('Payload reducer', () => {
  let reducer;
  let mockFormReducer;
  const mockFormState = 'mock-form-state';
  let state;

  beforeEach(() => {
    state = fromJS({ foo: 'bar' });
    mockFormReducer = jest.fn(() => mockFormState);
    jest.doMock('../form', () => mockFormReducer);

    reducer = require('./').default;
  });

  describe('DATA_ARRIVED action', () => {
    it('should return correct state', () => {
      const mockPayload = { payload: { hello: '123' }};

      expect(
        reducer(state, { type: types.DATA_ARRIVED, ...mockPayload })
      ).toEqual(
        fromJS({
          foo: 'bar',
          ...mockPayload.payload,
        })
      );
    });
  });

  describe('SOME_OTHER action', () => {
    it('should return correct state', () => {
      expect(
        reducer(state, { type: 'SOME_OTHER' })
      ).toEqual(
        fromJS({
          foo: 'bar',
          form: mockFormState,
        })
      );
    });
  });
});
