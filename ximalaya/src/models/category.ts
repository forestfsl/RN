/* eslint-disable @typescript-eslint/no-unused-vars */
import storage, {load} from '@/config/storage';
import {Effect, Model, SubscriptionsMapObject} from 'dva-core-ts';
import {Reducer} from 'react';
import axios from 'axios';
import {RootState} from '.';

const CATEGORY_URL = '/mock/11/forest/category';

export interface ICategory {
  id: string;
  name: string;
  classify?: string;
}

interface CategoryModelState {
  isEdit: boolean;
  myCategorys: ICategory[];
  categorys: ICategory[];
}

interface CategoryModel extends Model {
  namespace: 'category';
  state: CategoryModelState;
  effects: {
    loadData: Effect;
    toggle: Effect;
  };
  reducers: {
    setState: Reducer<CategoryModelState, any>;
  };
  subscriptions: SubscriptionsMapObject;
}

const initialState = {
  isEdit: false,
  myCategorys: [
    {id: 'home', name: '推荐', classify: ''},
    {id: 'vip', name: 'vip', classify: ''},
  ],
  categorys: [],
};

const categoryModel: CategoryModel = {
  namespace: 'category',
  state: initialState,
  effects: {
    *loadData(_, {call, put}) {
      //从storage里面获取数据
      const myCategorys = yield call(load, {key: 'myCategorys'});
      const categorys = yield call(load, {key: 'categorys'});
      //发起action，将数据保存到state里面
      if (myCategorys) {
        yield put({
          type: 'setState',
          payload: {
            myCategorys,
            categorys,
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            categorys,
          },
        });
      }
    },
    *toggle({payload}, {put, select}) {
      const category = yield select(({category}: RootState) => category);
      yield put({
        type: 'setState',
        payload: {
          isEdit: !category.isEdit,
          myCategorys: payload.myCategorys,
        },
      });
      if (category.isEdit) {
        storage.save({
          key: 'myCategorys',
          data: payload.myCategorys,
        });
      }
    },
  },
  reducers: {
    setState(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'loadData'});
    },
    asyncStorate() {
      storage.sync.categorys = async () => {
        const {data} = await axios.get(CATEGORY_URL);
        console.log(data);
        return data;
      };
      storage.sync.myCategorys = async () => {
        return null;
      };
    },
  },
};

export default categoryModel;
