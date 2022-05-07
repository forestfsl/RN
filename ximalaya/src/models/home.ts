import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'react';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {string} from 'prop-types';
import {RootState} from '.';

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

export interface IPagination {
  current: number;
  total: number;
  hasMore: boolean;
}

interface HomeState {
  carousels: ICarousel[];
  activeCarouselIndex: number; //当前轮播图的下标
  gradientVisible: boolean; //渐变色组件是否显示的状态
  guess: IGUESS[];
  channels: IChannel[];
  pagination: IPagination;
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
  activeCarouselIndex: 0,
  gradientVisible: true,
  guess: [],
  channels: [],
  pagination: {
    current: 1,
    total: 0,
    hasMore: true,
  },
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
      console.log('xxxxxxxxxxxxxxx轮播');
      console.log(CAROUSEl_URL);
      const {data} = yield call(axios.get, CAROUSEl_URL);
      console.log('轮播图数据', data);
      console.log(CAROUSEl_URL);
      yield put({
        type: 'setState',
        payload: {
          carousels: data,
        },
      });
    },
    *fetchChannels({callback, payload}, {call, put, select}) {
      const {channels, pagination} = yield select(
        (state: RootState) => state.home,
      );
      // console.log('xxxxxxxxxxxxxxx');
      let page = 1;
      if (payload && payload.loadMore) {
        page = pagination.current + 1;
        console.log(page);
      }
      const {data} = yield call(axios.get, CHAANEL_URL, {
        params: {
          page,
        },
      });
      let newChannels = data.results;
      if (payload && payload.loadMore) {
        newChannels = channels.concat(newChannels);
      }
      // console.log('列表数据', data);
      yield put({
        type: 'setState',
        payload: {
          channels: newChannels,
          pagination: {
            current: data.pagination.current,
            total: data.pagination.total,
            hasMore: newChannels.length < pagination.total,
          },
        },
      });
      if (typeof callback === 'function') {
        callback();
      }
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
