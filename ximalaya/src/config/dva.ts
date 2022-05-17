/* eslint-disable no-labels */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {create} from 'dva-core-ts';
import createLoading from 'dva-loading-ts';
import models from '@/models/index';
import modelExtend from 'dva-model-extend';
import homeModel from '@/models/home';
import {Model} from 'dva-core-ts';
import Toast from 'react-native-root-toast';

//1.创建实例
const app = create();
// onError: (e) => {
//   Toast.show('网络异常', {
//     duration: Toast.durations.LONG,
//     position: Toast.positions.CENTER,
//     shadow: true,
//     animation: true,
//   });
// };
//2.加载model对象
for (let model of models) {
  app.model(model);
}
app.use(createLoading());
//3.启动dva
app.start();
//4.导出dva的数据
export default app._store;

interface Cached {
  [key: string]: boolean;
}

const cached: Cached = {
  home: true,
};

function registerModel(model: Model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = true;
  }
}

export function createHomeModel(namespace: string) {
  const model = modelExtend(homeModel, {namespace});
  registerModel(model);
}
