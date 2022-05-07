/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Fragment} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Barrage from '@/components/Barrage';
import Touchable from '@/components/Touchable';
import {connect, ConnectedProps} from 'react-redux';
import {viewportWidth, statusBarHeight} from '@/utils/index';
import PlayBar from './PlayBar';
import {
  RootStackNavigation,
  ModalStackParamList,
  RootStackParamList,
} from '@/navigator/index';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '@/models/index';

const IMAGE_WIDTH = 180;

const SCALE = viewportWidth / (IMAGE_WIDTH * 0.9);

const mapStateToProps = ({player}: RootState) => {
  return {
    soundUrl: player.soundUrl,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  route: RouteProp<ModalStackParamList, 'ListDetail'>;
}
/**
 * 频道详情模块
 */
class ListDetail extends React.Component<IProps> {
  componentDidMount() {
    const {dispatch, route} = this.props;
    dispatch({
      type: 'player/fetchShow',
      payload: {
        id: route.params.id,
      },
    });
  }
  render() {
    return (
      <View>
        <Text>Detail</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#807c66',
  },
  scroll: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    right: 0,
    left: 0,
  },
  back: {
    marginTop: statusBarHeight,
    marginHorizontal: 20,
  },
  content: {
    paddingTop: 95,
    alignItems: 'center',
  },
  linear: {
    position: 'absolute',
    top: 0,
    height: viewportWidth + 100,
    width: viewportWidth,
  },
  barrage: {
    height: 400,
    top: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  imageView: {
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowColor: '#000',
      },
    }),
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 8,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 90,
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 20,
  },
  danmuBtn: {
    marginLeft: 10,
    height: 20,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
  },
  danmuText: {
    color: '#fff',
  },
});

export default connector(ListDetail);
