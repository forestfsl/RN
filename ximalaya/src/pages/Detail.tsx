import React from 'react';
import {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@/navigator/index';

interface IProps {
  route: RouteProp<RootStackParamList, 'Detail'>;
}
class Detail extends React.Component<IProps> {
  render() {
    // @ts-ignore
    // const {route} = this.props;
    return (
      <View>
        <Text>Detail</Text>
        {/* <Text>{route.params.id}</Text> */}
      </View>
    );
  }
}

export default Detail;
