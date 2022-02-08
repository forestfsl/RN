import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'react';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {string} from 'prop-types';

const CAROUSEl_URL = '/mock/11/forest/carousel';

export interface ICarousel {
  id: string;
  image: string;
  colors: [string, string];
}

interface HomeState {
  carousels: ICarousel[];
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
  };
}

const initialState = {
  carousels: [],
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
      console.log('轮播图数据', data);
      yield put({
        type: 'setState',
        payload: {
          carousels: data,
        },
      });
    },
  },
};

export default homeModel;
