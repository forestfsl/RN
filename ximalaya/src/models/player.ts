/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  initPlayer,
  pause,
  play,
  getCurrentTime,
  stop,
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
    const currentTime = yield call(getCurrentTime);
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
  playState: '',
  currentTime: 0,
  duration: 0,
  previousId: '',
  nextId: '',
  sounds: [],
};

const playerModel: PlayerModel = {
  namespace: 'player',
  state: initialState,
  reducers: {
    setState(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *fetchShow({payload}, {call, put}) {
      const {data} = yield call(axios.get, SHOW_URL, {
        params: {id: payload.id},
      });
      console.log('fetchData', data);
      yield call(initPlayer, data.soundUrl);
      yield put({
        type: 'setState',
        payload: {
          id: payload.id,
          soundUrl: data.soundUrl,
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
        },
      });
      yield call(play);
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
      yield call(stop);
      const {id, sounds}: PlayModelState = yield select(
        ({player}: RootState) => player,
      );
      const index = sounds.findIndex(item => item.id === id);
      const currentIndex = index - 1;
      const currentItem = sounds[currentIndex];
      const previousItem = sounds[currentIndex - 1];
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
          id: currentItem.id,
          title: currentItem.title,
          previousId: previousItem ? previousItem.id : '',
          nextId: id,
        },
      });
      yield put({
        type: 'fetchShow',
        payload: {
          id: currentItem.id,
        },
      });
    },
    *next({payload}, {call, put, select}) {
      yield call(stop);
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
          id: currentItem.id,
          title: currentItem.title,
          previousId: id,
          nextId: nextItem ? nextItem.id : '',
        },
      });
      yield put({
        type: 'fetchShow',
        payload: {
          id: currentItem.id,
        },
      });
    },
  },
};

export default playerModel;
