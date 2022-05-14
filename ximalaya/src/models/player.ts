/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  initPlayer,
  pause,
  play,
  getCurrentTime,
  stop,
  sound,
  getDuration,
} from '@/config/sound';
import axios from 'axios';
import {Effect, EffectsCommandMap, EffectWithType, Model} from 'dva-core-ts';
import {Reducer} from 'react';
import {State} from 'react-native-gesture-handler';
import {call} from 'react-native-reanimated';
import {RootState} from '.';

const SHOW_URL = '/mock/11/forest/show';

export interface PlayModelState {
  id: string;
  title: string;
  thumbnailUrl: string;
  sliderEditing: boolean;
  percent: number;
  soundUrl: string;
  playState: string;
  currentTime: number;
  duration: number;
  previousId: string;
  nextId: string;
  sounds: {id: string; title: string}[];
}

const delay = (timeout: number) =>
  new Promise(reslove => setTimeout(reslove, timeout));

function* currentTime({call, put}: EffectsCommandMap) {
  while (true) {
    yield call(delay, 1000);
    const currentTime: number = yield call(getCurrentTime);
    console.log('当前的时间戳', currentTime);
    yield put({
      type: 'setState',
      payload: {
        currentTime,
      },
    });
  }
}

export interface PlayerModel extends Model {
  namespace: 'player';
  state: PlayModelState;
  reducers: {
    setState: Reducer<PlayModelState, any>;
  };
  effects: {
    fetchShow: Effect;
    play: Effect;
    pause: Effect;
    watcherCurrentTime: EffectWithType;
    previous: Effect;
    next: Effect;
  };
}

const initialState: PlayModelState = {
  id: '',
  soundUrl: '',
  thumbnailUrl: '',
  sliderEditing: false,
  percent: 0,
  playState: '',
  currentTime: 0,
  duration: 0,
  previousId: '',
  nextId: '',
  sounds: [],
  title: '',
};

const playerModel: PlayerModel = {
  namespace: 'player',
  state: initialState,
  reducers: {
    setState(state, {payload}) {
      const newState = {
        ...state,
        ...payload,
      };
      const percent =
        (newState.currentTime / newState.duration ? newState.duration : 0) *
        100;
      newState.percent = percent;
      return newState;
    },
  },
  effects: {
    *fetchShow({payload}, {call, put}) {
      console.log('fetchShow');
      const {data} = yield call(axios.get, SHOW_URL, {
        params: {id: payload.id},
      });
      console.log('fetchData', data);
      if (sound) {
        yield call(stop);
        sound.stop();
      }
      try {
        yield call(initPlayer, data.soundUrl);
      } catch (error) {
        console.log('initPlayer', error);
      }
      yield put({
        type: 'setState',
        payload: {
          id: payload.id,
          soundUrl: data.soundUrl,
          thumbnailUrl: data.thumbnailUrl,
          currenTime: 0,
          duration: getDuration(),
        },
      });
      yield put({
        type: 'play',
      });
    },
    *play({payload}, {call, put}) {
      yield put({
        type: 'setState',
        payload: {
          playState: 'playing',
          duration: getDuration(),
        },
      });
      try {
        yield call(play);
      } catch (error) {
        console.log('播放音频失败', error);
      }
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
        },
      });
    },
    *pause({payload}, {call, put}) {
      yield call(pause);
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
        },
      });
    },
    watcherCurrentTime: [
      function*(sagaEffects) {
        const {call, take, race} = sagaEffects;
        while (true) {
          yield take('play');
          yield race([call(currentTime, sagaEffects), take('pause')]);
        }
      },
      {type: 'watcher'},
    ],
    *previous({payload}, {call, put, select}) {
      const {id, sounds}: PlayModelState = yield select(
        ({player}: RootState) => player,
      );
      const index = sounds.findIndex(item => item.id === id);
      const currentIndex = index > 0 ? index - 1 : 0;
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      const currentItem = sounds[currentIndex];
      const previousItem = sounds[previousIndex];
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
          id: currentItem ? currentItem.id : '',
          title: currentItem ? currentItem.title : '',
          previousId: previousItem ? previousItem.id : '',
          nextId: id ? id : '',
        },
      });
      yield put({
        type: 'fetchShow',
        payload: {
          id: currentItem ? currentItem.id : '',
        },
      });
    },
    *next({payload}, {call, put, select}) {
      const {id, sounds}: PlayModelState = yield select(
        ({player}: RootState) => player,
      );
      const index = sounds.findIndex(item => item.id === id);
      const currentIndex = index + 1;
      const currentItem = sounds[currentIndex];
      const nextItem = sounds[currentIndex + 1];
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
          id: currentItem ? currentItem.id : '',
          title: currentItem ? currentItem.title : '',
          previousId: id,
          nextId: nextItem ? nextItem.id : '',
        },
      });
      yield put({
        type: 'fetchShow',
        payload: {
          id: currentItem ? currentItem.id : '',
        },
      });
    },
  },
};

export default playerModel;
