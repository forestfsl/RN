import home from './home';
import {DvaLoadingState} from 'dva-loading-ts';
import category from './category';

const models = [home, category];

export type RootState = {
  home: typeof home.state;
  category: typeof category.state;
  loading: DvaLoadingState;
} & {
  [key: string]: typeof home.state;
};

export default models;
