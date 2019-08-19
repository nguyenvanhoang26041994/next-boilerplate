import { profilePage } from './constants';
import { fetchProfile, fetchOwnerMusics } from './fetchs';
export const getProfileRequest = () => ({
  type: profilePage.GET_PROFILE_REQUEST,
});

export const getProfileSuccess = payload => ({
  type: profilePage.GET_PROFILE_SUCCESS,
  payload,
});

export const getProfileFailure = () => ({
  type: profilePage.GET_PROFILE_FAILURE,
});

export const getProfile = (id, callback) => async (dispatch) => {
  dispatch(getProfileRequest());
  try {
    const profile = await fetchProfile(id);
    dispatch(getProfileSuccess(profile));
    callback && callback(profile);
  } catch (e) {
    dispatch(getProfileFailure());
  }
};

export const getOwnerMusicsRequest = () => ({
  type: profilePage.GET_OWNER_MUSICS_REQUEST,
});

export const getOwnerMusicsSuccess = payload => ({
  type: profilePage.GET_OWNER_MUSICS_SUCCESS,
  payload,
});

export const getOwnerMusicsFailure = () => ({
  type: profilePage.GET_OWNER_MUSICS_FAILURE,
});

export const getOwnerMusics = (id, callback) => async (dispatch) => {
  dispatch(getOwnerMusicsRequest());
  try {
    const musics = await fetchOwnerMusics(id);
    dispatch(getOwnerMusicsSuccess(musics));
    callback && callback(musics);
  } catch (e) {
    dispatch(getOwnerMusicsFailure());
  }
};
