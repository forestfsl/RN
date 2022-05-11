import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Slider from 'react-native-slider-x';
import {connect, ConnectedProps} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '@/models/index';
import {ModalStackParamList} from '@/navigator/index';
import {formatTime} from '@/utils/index';

const mapStateToProps = ({player}: RootState) => {
  return {
    currentTime: player.currentTime,
    duration: player.duration,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  route: RouteProp<ModalStackParamList, 'ListDetail'>;
}

class PlaySlider extends React.Component<IProps> {
  renderThumb = () => {
    const {currentTime, duration} = this.props;
    return (
      <View>
        <Text style={styles.text}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>
    );
  };
  render() {
    const {currentTime, duration} = this.props;
    return (
      <View style={styles.container}>
        <Slider
          value={currentTime}
          maximumValue={duration}
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          minimumTrackTintColor="white"
          renderThumb={this.renderThumb}
          thumbStyle={styles.thumb}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    backgroundColor: '#fff',
    width: 76,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
  },
  container: {
    margin: 10,
  },
});

export default connector(PlaySlider);
