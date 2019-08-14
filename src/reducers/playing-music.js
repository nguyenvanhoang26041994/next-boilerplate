import { music } from '../constants/playing-music';

const defaultState = {
  id: '',
  src: '',
  name: '',
  singer: {},
  singers: [],
  img: '',
  isPlaying: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case music.CHANGE_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };
    case music.CHANGE_MUSIC:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
