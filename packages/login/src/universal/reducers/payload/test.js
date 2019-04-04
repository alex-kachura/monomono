import * as types from '../../actions';

describe('Payload reducer', () => {
  let reducer;
  let state;

  beforeEach(() => {
    state = { foo: 'bar' };

    reducer = require('./').default;
  });

  describe('DATA_ARRIVED action', () => {
    it('should return correct state', () => {
      const mockPayload = { payload: { hello: '123' }};

      expect(
        reducer(state, { type: types.DATA_ARRIVED, ...mockPayload })
      ).toEqual(mockPayload.payload);
    });
  });

  describe('SOME_OTHER action', () => {
    it('should return correct state', () => {
      expect(
        reducer(state, { type: 'SOME_OTHER' })
      ).toEqual(state);
    });
  });
});
