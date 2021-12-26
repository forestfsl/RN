import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'react';

interface HomeState {
  num: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const action = {
  type: 'add',
};

interface HomeModel extends Model {
  namespace: 'home';
  state: HomeState;
  reducers: {
    add: Reducer<HomeState, any>;
  };
  effects: {
    asyncAdd: Effect;
  };
}

const initialState = {
  num: 1,
};

function delay(timeout: number) {
  return new Promise(reslove => {
    setTimeout(reslove, timeout);
  });
}

const homeModel: HomeModel = {
  namespace: 'home',
  state: initialState,
  reducers: {
    add(state = initialState, {payload}) {
      return {
        ...state,
        num: state.num + payload.num,
      };
    },
  },
  effects: {
    *asyncAdd({payload}, {call, put}) {
      yield call(delay, 3000);
      yield put({
        type: 'add',
        payload,
      });
    },
  },
};

export default homeModel;
