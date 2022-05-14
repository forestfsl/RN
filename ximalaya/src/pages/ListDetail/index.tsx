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
import Icon from '@/assets/iconfont/index';
import LinearGradient from 'react-native-linear-gradient';
import Barrage, {Message} from '@/components/Barrage';
import Touchable from '@/components/Touchable';
import {connect, ConnectedProps} from 'react-redux';
import {viewportWidth, statusBarHeight} from '@/utils/index';
import {
  RootStackNavigation,
  ModalStackParamList,
  RootStackParamList,
  ModalStackNavigation,
} from '@/navigator/index';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '@/models/index';
import PlaySlider from './PlaySlider';
import {play} from '@/config/sound';

const IMAGE_WIDTH = 180;

const SCALE = viewportWidth / (IMAGE_WIDTH * 0.9);

const data: string[] = [
  '最灵繁的人也看不见自己的背脊',
  '朝闻道，夕死可矣',
  '阅读是人类进步的阶梯',
  '内外相应，言行相称',
  '人的一生是短的',
  '抛弃时间的人，时间也抛弃他',
  '自信在于沉稳',
  '过犹不及',
  '开卷有益',
  '有志者事竟成',
  '合理安排时间，就等于节约时间',
  '成功源于不懈的努力',
];

const mapStateToProps = ({player}: RootState) => {
  return {
    id: player.id,
    soundUrl: player.soundUrl,
    playState: player.playState,
    thumbnailUrl: player.thumbnailUrl,
    title: player.title,
    previousId: player.previousId,
    nextId: player.nextId,
  };
};

const getRundomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

const getText = () => {
  const number = getRundomNumber(data.length - 1);
  return data[number];
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IState {
  data: Message[];
  barrage: boolean;
}

interface IProps extends ModelState {
  navigation: ModalStackNavigation;
  route: RouteProp<ModalStackParamList, 'ListDetail'>;
}
/**
 * 频道详情模块
 */
class ListDetail extends React.Component<IProps, IState> {
  state = {
    barrage: false,
    data: [],
  };
  interval = -1;
  imageStyle: StyleProp<ViewStyle>;

  anim = new Animated.Value(1);

  componentDidMount() {
    const {dispatch, route, navigation, title, id} = this.props;
    // if (route.params && route.params.id !== id) {
    //   dispatch({
    //     type: 'player/fetchShow',
    //     payload: {
    //       id: route.params.id,
    //     },
    //   });
    //   navigation.setOptions({
    //     headerTitle: title,
    //   });
    // } else {
    //   dispatch({
    //     type: 'player/play',
    //   });
    // }
    dispatch({
      type: 'player/fetchShow',
      payload: {
        id: route.params.id,
      },
    });
    navigation.setOptions({
      headerTitle: title,
    });
    this.addBarrageWithInterval();
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.title !== prevProps.title) {
      this.props.navigation.setOptions({
        headerTitle: this.props.title,
      });
    }
  }

  toogle = () => {
    const {dispatch, playState} = this.props;
    dispatch({
      type: playState === 'playing' ? 'player/pause' : 'player/play',
    });
  };

  previous = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'player/previous',
    });
  };

  next = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'player/next',
    });
  };
  addBarrageWithInterval = () => {
    this.interval = setInterval(() => {
      const {barrage} = this.state;
      if (barrage) {
        const text = getText();
        const newData = [{title: text, id: Date.now()}];
        this.setState({data: newData});
      } else if (!barrage && this.state.data.length !== 0) {
        this.setState({
          data: [],
        });
      }
    }, 500);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  danmu = () => {
    const {barrage} = this.state;
    this.setState({
      barrage: !barrage,
    });

    Animated.timing(this.anim, {
      toValue: !barrage ? SCALE : 1,
      duration: 100,
      easing: Easing.linear, // 线性的渐变函数
    }).start();
  };

  render() {
    const {playState, previousId, nextId, thumbnailUrl} = this.props;
    const {barrage, data} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.imageView}>
            <Animated.Image
              style={[
                styles.image,
                {
                  transform: [
                    {
                      scale: this.anim,
                    },
                  ],
                },
              ]}
              source={{
                uri: thumbnailUrl
                  ? thumbnailUrl
                  : 'https://user-images.githubusercontent.com/3541185/67040161-c9e23680-f11a-11e9-8f7a-aabb7fe1d7f4.png',
              }}
            />
          </View>
          {barrage && (
            <Fragment>
              <LinearGradient
                colors={[
                  'rgba(128, 104, 102, 0.5)',
                  'rgba(128, 104, 102, 0.8)',
                  '#807c66',
                  '#807c66',
                ]}
                style={styles.linear}
              />
              <Barrage style={styles.barrage} data={data} maxTrack={5} />
            </Fragment>
          )}
        </View>
        <View>
          <Touchable onPress={this.danmu} style={styles.danmuBtn}>
            <Text style={styles.danmuText}>弹幕</Text>
          </Touchable>
        </View>
        <PlaySlider />
        <View style={styles.control}>
          <Touchable
            disabled={!previousId}
            onPress={this.previous}
            style={styles.button}>
            <Icon name="icon-shangyishou" size={30} color="#fff" />
          </Touchable>
          <Touchable
            disabled={!nextId}
            onPress={this.toogle}
            style={styles.button}>
            <Icon
              name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
              color="#fff"
            />
          </Touchable>
          <Touchable onPress={this.next}>
            <Icon name="icon-xiayishou" size={30} color="#fff" />
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: '#807c66',
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 90,
  },
  // control: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginVertical: 15,
  //   marginHorizontal: 90,
  // },
  button: {
    marginHorizontal: 10,
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
