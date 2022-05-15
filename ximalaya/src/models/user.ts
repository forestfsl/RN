/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import {Effect, Model} from 'dva-core-ts';
import {Alert} from 'react-native';
import {Reducer} from 'redux';
import {goBack} from '@/utils/index';

const USER_URL = '/mock/11/forest/login';

export interface IUser {
  name: string;
  avatar: string;
}

export interface UserModelState {
  user?: IUser;
}

export interface UserModel extends Model {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setState: Reducer<UserModelState>;
  };
}

const initialState = {
  user: undefined,
};

const userModel: UserModel = {
  namespace: 'user',
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
    *login({payload}, {call, put}) {
      const {data, status, msg} = yield call(axios.post, USER_URL, payload);
      if (status === 100) {
        yield put({
          type: 'setState',
          payload: {
            user: data,
          },
        });
        console.log('登录成功');
        goBack();
      } else {
        console.log(msg);
      }
    },
    *logout(_, {put}) {
      yield put({
        type: 'setState',
        payload: {
          user: undefined,
        },
      });
    },
  },
};

export default userModel;
