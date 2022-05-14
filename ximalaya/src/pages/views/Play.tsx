/* eslint-disable @typescript-eslint/no-unused-vars */
import Touchable from '@/components/Touchable';
import React from 'react';
import {Image, StyleSheet, Text, View, Easing, Animated} from 'react-native';
import Icon from '@/assets/iconfont/index';
import {RootState} from '@/models/index';
import {play} from '@/config/sound';
import {connect, ConnectedProps} from 'react-redux';
import Progress from './Progress';

const mapStateToProps = ({player}: RootState) => {
  return {
    thumbnailUrl: player.thumbnailUrl,
    playState: player.playState,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

export interface IProprs extends ModelState {
  onPress: () => void;
}

class Play extends React.Component<IProprs> {
  anim = new Animated.Value(0);
  rotate: Animated.AnimatedInterpolation;
  timing: Animated.CompositeAnimation;
  constructor(props: IProprs) {
    super(props);
    this.timing = Animated.loop(
      Animated.timing(this.anim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {iterations: -1}, //无限循环
    );
    this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    this.rotate = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  }
  componentDidMount() {
    const {playState} = this.props;
    if (playState === 'playing') {
      this.timing.start();
    }
  }
  componentDidUpdate() {
    const {playState} = this.props;
    if (playState === 'playing') {
      this.timing.start();
    } else if (playState === 'paused') {
      this.timing.stop();
    }
  }
  onPress = () => {
    const {onPress, thumbnailUrl} = this.props;
    console.log('Play onPress');
    if (onPress && thumbnailUrl) {
      console.log('onPress');
      onPress();
    }
  };
  render() {
    const {playState, thumbnailUrl} = this.props;
    return (
      <Touchable style={styles.play} onPress={this.onPress}>
        <Progress>
          <Animated.View style={{transform: [{rotate: this.rotate}]}}>
            {thumbnailUrl ? (
              <Animated.Image
                source={{uri: thumbnailUrl}}
                style={styles.image}
              />
            ) : (
              <Icon name="icon-bofang3" color="#ededed" size={40} />
            )}
          </Animated.View>
          {playState === 'paused' && (
            <View style={styles.pauseImage}>
              <Icon name="icon-bofang" color="#f86442" size={15} />
            </View>
          )}
        </Progress>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  play: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  pauseImage: {
    // width: 42,
    // height: 42,
    position: 'absolute',
    // top: 10,
    // left: 10,
  },
});

export default connector(Play);
