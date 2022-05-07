/* eslint-disable @typescript-eslint/no-unused-vars */
import {initPlayer, playComplete} from '@/config/sound';
import axios from 'axios';
import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'react';
import {State} from 'react-native-gesture-handler';

const SHOW_URL = '/mock/11/forest/show';

export interface PlayModelState {
  id: string;
  soundUrl: string;
  playState: string;
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
  };
}

const initialState: PlayModelState = {
  id: '',
  soundUrl: '',
  playState: '',
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
      yield put({
        type: 'setState',
        payload: {
          id: data.id,
          soundUrl: data.soundUrl,
        },
      });
      yield call(initPlayer, data.soundUrl);
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
      yield call(playComplete);
      yield put({
        type: 'setState',
        payload: {
          playState: 'paused',
        },
      });
    },
  },
};

export default playerModel;
