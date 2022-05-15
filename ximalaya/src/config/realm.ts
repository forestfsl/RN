import Realm from 'realm';

export interface IProgram {
  id: string;
  title: string;
  thumbnailUrl: string;
  currentTime: number;
  duration: number;
  rate: number;
}

class Program {
  currentTime = 0;
  duration = 0;
  static schema = {
    name: 'Program',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      thumbnailUrl: 'string',
      currentTime: {type: 'double', default: 0},
      duration: {type: 'double', default: 0},
    },
  };
  get rate() {
    return this.duration > 0
      ? Math.floor(((this.currentTime * 100) / this.duration) * 100) / 100
      : 0;
  }
}

// 第一个架构将会被更新到现有的架构版本
// 因为第一个架构位于数组顶部
// var nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);

// console.log('-------realm', nextSchemaIndex)

// var schemas = [
//     { schema: [Show], schemaVersion: 0 },
//     { schema: [Show], schemaVersion: 1 },
// ]

// while (nextSchemaIndex < schemas.length) {
//     var migratedRealm = new Realm(schemas[nextSchemaIndex++]);
//     // migratedRealm.clear();
//     migratedRealm.close();
// }

// 使用最新的架构打开 Realm 数据库
// var realm = new Realm(schemas[schemas.length - 1]);

const realm = new Realm({schema: [Program], schemaVersion: 1});

export function saveProgram(data: Partial<IProgram>) {
  try {
    realm.write(() => {
      realm.create('Program', data, true);
    });
  } catch (error) {
    console.log('保存失败');
  }
}

export default realm;
