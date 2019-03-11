import { push } from 'connected-react-router';
import { validateAllFields } from '@oneaccount/form-validation';
import fetch from '../../../utils/fetch';
import * as types from '../../actions';
import { getFocusFieldId } from '../../../utils/validation';

// Helper method to form the data you want to post for a particular mapping
function getData(fields) {
  const values = {};

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return values;
}

// Place mappings to various data types here to pull in data based on the client-side route you're going to
const mapping = {
  sampleData: {
    getUrl: (rootPath) => `${rootPath}/edit`,
    getBody: getData,
  },
};

async function doFetch(getLocalePhrase, dataType, validatedFields, rootPath) {
  let actionPayload = {};
  const banner = {
    bannerType: 'error',
    title: getLocalePhrase('banners.error.update.title'),
    errorType: 'update',
  };

  try {
    const res = await fetch({
      method: 'POST',
      url: mapping[dataType].getUrl(rootPath),
      body: mapping[dataType].getBody(validatedFields),
    });

    if (res.ok) {
      actionPayload = await res.json();
    }
    // Will redirect if session timed out (401), no need for banner in that case
    else if (res.status !== 401) {
      actionPayload.payload = { banner };
    }

    // Record response status and location in case we need to redirect to login page
    // if session timed out (determined in Redux middleware method)
    actionPayload.response = {
      status: res.status,
      location: res.headers.get('location'),
    };
  } catch (error) {
    actionPayload.payload = { banner };
  }

  return actionPayload;
}

export function saveData(dataType) {
  return async (dispatch, getState) => {
    const state = getState();
    const fields = state.getIn(['payload', 'form', 'fields']).toJS();
    const rootPath = state.get('rootPath');

    // Validate all fields
    const validatedFields = validateAllFields(fields);
    const isFormValid = validatedFields.every(({ isValid }) => isValid);

    if (!isFormValid) {
      return dispatch({
        type: types.VALIDATE_FIELDS,
        fields: validatedFields,
        isFormValid,
        focusFieldId: getFocusFieldId(validatedFields, isFormValid),
      });
    }

    dispatch({ type: types.DATA_LOADING });

    const actionPayload = await doFetch(
      state.get('getLocalePhrase'), dataType, validatedFields, rootPath
    );

    // If server response says user data successfully updated
    if (actionPayload.updated) {
      dispatch({
        type: types.DATA_ARRIVED,
        payload: actionPayload.payload,
        response: actionPayload.response,
      });

      return dispatch(push(rootPath));
    }

    return dispatch({
      type: types.DATA_ARRIVED,
      ...actionPayload,
    });
  };
}
