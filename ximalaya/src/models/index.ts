import home from './home';
import {DvaLoadingState} from 'dva-loading-ts';
import category from './category';
import album from './album';
import player from './player';
import found from './found';
import user from './user';

const models = [home, category, album, player, found, user];

export type RootState = {
  home: typeof home.state;
  category: typeof category.state;
  player: typeof player.state;
  user: typeof user.state;
  album: typeof album.state;
  loading: DvaLoadingState;
} & {
  [key: string]: typeof home.state;
};

export default models;
