import fetch from '../../../utils/fetch';
import * as types from '../../actions';

async function doFetch(url, state) {
  const getLocalePhrase = state.get('getLocalePhrase');
  let actionPayload = {};
  const banner = {
    bannerType: 'error',
    title: getLocalePhrase('banners.error.load.title'),
    errorType: 'load',
  };

  try {
    const res = await fetch({ url });

    if (res.ok) {
      actionPayload = await res.json();
    } else {
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

export function getData(url, e) {
  return async (dispatch, getState) => {
    if (e) {
      e.preventDefault();
    }

    dispatch({ type: types.DATA_LOADING });

    const actionPayload = await doFetch(url, getState());

    return dispatch({
      type: types.DATA_ARRIVED,
      ...actionPayload,
    });
  };
}
