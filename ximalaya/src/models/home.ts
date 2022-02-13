import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'react';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {string} from 'prop-types';

//轮播图
const CAROUSEl_URL = '/mock/11/forest/carousel';

//猜你喜欢
const GUESS_URL = '/mock/11/forest/guess';

//首页列表
const CHAANEL_URL = '/mock/11/forest/channel';

export interface ICarousel {
  id: string;
  image: string;
  colors: [string, string];
}

export interface IGUESS {
  id: string;
  image: string;
  title: string;
}

export interface IChannel {
  id: string;
  title: string;
  image: string;
  remark: string;
  played: number;
  playing: number;
}

interface HomeState {
  carousels: ICarousel[];
  guess: IGUESS[];
  channels: IChannel[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const action = {
  type: 'setState',
};

interface HomeModel extends Model {
  namespace: 'home';
  state: HomeState;
  reducers: {
    setState: Reducer<HomeState, any>;
  };
  effects: {
    fetchCarousel: Effect;
    fetchGuess: Effect;
    fetchChannels: Effect;
  };
}

const initialState: HomeState = {
  carousels: [],
  guess: [],
  channels: [],
};

const homeModel: HomeModel = {
  namespace: 'home',
  state: initialState,
  reducers: {
    setState(state = initialState, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *fetchCarousel(_, {call, put}) {
      const {data} = yield call(axios.get, CAROUSEl_URL);
      // console.log('轮播图数据', data);
      yield put({
        type: 'setState',
        payload: {
          carousels: data,
        },
      });
    },
    *fetchChannels(_, {call, put}) {
      const {data} = yield call(axios.get, CHAANEL_URL);
      // console.log('列表数据', data);
      yield put({
        type: 'setState',
        payload: {
          channels: data.results,
        },
      });
    },
    *fetchGuess(_, {call, put}) {
      // console.log('YYYYYYY');
      const {data} = yield call(axios.get, GUESS_URL);
      // console.log('猜一猜', data);
      yield put({
        type: 'setState',
        payload: {
          guess: data,
        },
      });
    },
  },
};

export default homeModel;
