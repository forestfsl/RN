// import React from 'react';
// import {View, Text} from 'react-native';
// import {test} from './pages/test/test/index';
//
// test();
//
// class App extends React.Component<any, any> {
//   render() {
//     return (
//       <View>
//         <Text>测试内容林德洛夫龙卷风d App</Text>
//       </View>
//     );
//   }
// }
//
// export default App;
import Navigator from './navigator';
import React from 'react';
import {Provider} from 'react-redux';
import store from '@/config/dva';
import {StatusBar} from 'react-native';

export default class extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />
      </Provider>
    );
  }
}

// export default Navigator;
