/* eslint-disable no-sparse-arrays */
import {viewportWidth} from '@/utils/';
import {transform} from 'lodash';
import React from 'react';
import {Animated, Text, Easing} from 'react-native';

class Barrage2 extends React.Component {
  translateX = new Animated.Value(0);
  componentDidMount() {
    Animated.timing(this.translateX, {
      toValue: 10,
      duration: 6000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }
  render() {
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateX: this.translateX.interpolate({
                inputRange: [0, 10],
                outputRange: [viewportWidth, 0],
              }),
            },
            ,
          ],
        }}>
        <Text>我是弹幕</Text>
      </Animated.View>
    );
  }
}

export default Barrage2;
