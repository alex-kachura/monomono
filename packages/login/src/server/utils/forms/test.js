import { mergeValuesWithFields } from '.';

describe('#mergeValuesWithFields', () => {
  const fields = [
    {
      id: 'mock-id1',
      value: ''
    },
    {
      id: 'mock-id2',
      value: '',
    },
  ];

  const values = {
    'mock-id1': 'mock-val',
  };

  it('should return fields with merged values', () => {
    expect(mergeValuesWithFields(values, fields)).toEqual([
      {
        id: 'mock-id1',
        value: 'mock-val'
      },
      {
        id: 'mock-id2',
        value: '',
      },
    ]);
  });
});
