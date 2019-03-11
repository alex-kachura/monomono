import Immutable from 'immutable';
import {
  getField,
  getFocusFieldId,
} from './';

describe('Validation utilities', () => {
  let result;
  const fields = Immutable.fromJS([
    {
      name: 'currentPassword',
      id: 'current-password',
      hasBlurred: false,
      isValid: true,
      value: '',
      constraints: [
        {
          type: 'mandatory',
          text: 'Please enter your current password',
          validator: true,
          isValid: true,
        },
      ],
    },
    {
      name: 'confirmPassword',
      id: 'confirm-password',
      hasBlurred: false,
      isValid: false,
      value: '',
      constraints: [
        {
          type: 'mandatory',
          text: 'Please confirm your password',
          validator: true,
          isValid: true,
        },
        {
          type: 'match',
          text: 'Your passwords do not match',
          target: 'newPassword',
          isValid: true,
        },
      ],
    },
  ]);

  describe('#getField', () => {
    it('should retrieve the correct field if it exists', () => {
      result = getField(fields, 'confirmPassword');

      expect(result.get('name')).toBe('confirmPassword');
    });

    it('should return undefined if field does not exist', () => {
      result = getField(fields, 'doesNotExist');

      expect(result).toBe(undefined);
    });

    it('should return undefined if fields array does not exist', () => {
      result = getField(undefined, 'doesNotExist');

      expect(result).toBe(undefined);
    });
  });

  describe('#getFocusFieldId', () => {
    it('should return ID of the first invalid field', () => {
      result = getFocusFieldId(fields.toJS(), false);

      expect(result).toBe('confirm-password');
    });

    it('should return null if form is valid', () => {
      result = getFocusFieldId(fields.toJS(), true);

      expect(result).toBe(null);
    });

    it('should return null if no invalid field is found', () => {
      const validFields = [
        {
          name: 'currentPassword',
          id: 'current-password',
          hasBlurred: false,
          isValid: true,
          value: '',
        },
      ];

      result = getFocusFieldId(validFields, false);

      expect(result).toBe(null);
    });
  });
});
