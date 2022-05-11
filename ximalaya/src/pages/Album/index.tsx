/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  findNodeHandle,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {RootState} from '@/models/index';
import albumModel, {IProgram} from '@/models/album';
import {ConnectedProps, connect} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {ModalStackNavigation, RootStackParamList} from '@/navigator/index';
import coverRight from '@/assets/cover-right.png';
import {BlurView} from '@react-native-community/blur';
import {
  TapGestureHandler,
  PanGestureHandler,
  NativeViewGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Tab from './Tab';
import {viewportHeight} from '@/utils/index';

const HEADER_HEIGHT = 260;
const USE_NATIVE_DRIVER = true;

const mapStateToProps = ({album}: RootState) => {
  return {
    summary: album.summary,
    author: album.author,
    list: album.list,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: ModalStackNavigation;
  headerHeight: number;
  route: RouteProp<RootStackParamList, 'Album'>;
}

interface IState {
  viewRef: number | null;
}

class Album extends React.Component<IProps> {
  headerHeight = this.props.headerHeight;
  START = -(HEADER_HEIGHT - this.headerHeight);
  END = 0;
  // 手指拖动的Y轴距离
  dragY = new Animated.Value(0);
  // 上一次拖动的Y轴距离
  translateYOffset = new Animated.Value(0);
  backgroundImage = React.createRef<Image>();
  tapRef = React.createRef<TapGestureHandler>();
  panRef = React.createRef<PanGestureHandler>();
  nativeRef = React.createRef<NativeViewGestureHandler>();
  lastScrollYValue = 0;
  lastScrollY = new Animated.Value(0);
  reverseLastScrollY = Animated.multiply(
    new Animated.Value(-1),
    this.lastScrollY,
  );
  translateYValue = 0;
  translateYInterpolateValue = 0;
  translate = Animated.add(
    Animated.add(this.dragY, this.reverseLastScrollY),
    this.translateYOffset,
  );
  translateY = this.translate.interpolate({
    inputRange: [this.START, this.END],
    outputRange: [this.START, this.END],
    extrapolate: 'clamp',
  });
  // 监听FlatList滚动
  onScrollDrag = Animated.event<{contentOffset: {y: number}}>(
    [{nativeEvent: {contentOffset: {y: this.lastScrollY}}}],
    {
      useNativeDriver: USE_NATIVE_DRIVER,
      listener: ({nativeEvent}) => {
        this.lastScrollYValue = nativeEvent.contentOffset.y;
      },
    },
  );
  constructor(props: IProps) {
    super(props);
    this.state = {
      viewRef: null,
    };
    props.navigation.setParams({
      opacity: this.translateY.interpolate({
        inputRange: [this.START, this.END],
        outputRange: [1, 0],
      }),
    });
  }

  componentDidMount() {
    const {dispatch, route} = this.props;
    const {id} = route.params.item;
    dispatch({
      type: 'album/fetchAlbum',
      payload: {
        id,
      },
    });
    this.translate.addListener(({value}) => {
      this.translateYValue = value;
    });
    this.translateY.addListener(({value}) => {
      this.translateYInterpolateValue = value;
    });
  }
  onGestureEvent = Animated.event([{nativeEvent: {translationY: this.dragY}}], {
    useNativeDriver: USE_NATIVE_DRIVER,
  });
  onHandlerStateChange = ({nativeEvent}: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let {translationY} = nativeEvent;
      translationY -= this.lastScrollYValue;
      this.translateYOffset.extractOffset();
      this.translateYOffset.setValue(translationY);
      this.translateYOffset.flattenOffset();
      this.dragY.setValue(0);
      let maxDeltaY = 0;

      if (translationY < 0 && this.translateYValue < this.START) {
        Animated.timing(this.translateYOffset, {
          toValue: this.START,
          useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
        maxDeltaY = this.END;
      } else if (translationY > 0 && this.translateYValue > this.END) {
        Animated.timing(this.translateYOffset, {
          toValue: this.END,
          useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
        maxDeltaY = -this.START;
      } else {
        maxDeltaY = -this.translateYInterpolateValue;
      }
      //   if (this.tapRef.current) {
      //     this.tapRef.current.setNativeProps({
      //       maxDeltaY,
      //     });
      //   }
    }
  };

  onItemPress = (data: IProgram, index: number) => {
    const {navigation, dispatch, list} = this.props;
    const previousItem = list[index - 1];
    navigation.navigate('ListDetail', {id: data.id});
    const nextItem = list[index + 1];
    dispatch({
      type: 'player/setState',
      payload: {
        previousId: previousItem ? previousItem.id : '',
        nextId: nextItem ? nextItem.id : '',
        sounds: list.map(item => ({id: item.id, title: item.title})),
      },
    });
  };

  imageLoaded = () => {
    this.setState({viewRef: findNodeHandle(this.backgroundImage.current)});
  };

  renderHeader = () => {
    const {headerHeight, summary, author, route} = this.props;
    const {title, image} = route.params.item;
    // console.log(headerHeight);
    console.log(author.avatar);
    return (
      <View style={[styles.header, {paddingTop: headerHeight}]}>
        <Image source={{uri: image}} style={styles.background} />
        <BlurView
          blurType="light"
          blurAmount={5}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.leftView}>
          <Image source={{uri: image}} style={styles.thumbnail} />
          <Image source={coverRight} style={styles.coverRight} />
        </View>
        <View style={styles.rightView}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.summary}>
            <Text numberOfLines={1} style={styles.summaryText}>
              {summary}
            </Text>
          </View>
          <View style={styles.author}>
            <Image source={{uri: author.avatar}} style={styles.avatar} />
            <Text style={styles.name}>{author.name}</Text>
          </View>
        </View>
      </View>
    );
  };
  render() {
    const {route} = this.props;
    return (
      <TapGestureHandler maxDeltaY={-this.START} ref={this.tapRef}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {transform: [{translateY: this.translateY}]},
            ]}>
            <PanGestureHandler
              ref={this.panRef}
              simultaneousHandlers={[this.tapRef, this.nativeRef]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this.onGestureEvent}
              onHandlerStateChange={this.onHandlerStateChange}>
              <Animated.View>
                {this.renderHeader()}
                <View
                  style={[
                    styles.tab,
                    {height: viewportHeight - this.headerHeight},
                  ]}>
                  <Tab
                    nativeRef={this.nativeRef}
                    tapRef={this.tapRef}
                    panRef={this.panRef}
                    route={route}
                    onScrollDrag={this.onScrollDrag}
                    onItemPress={this.onItemPress}
                  />
                </View>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 260,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#eee',
  },
  leftView: {
    marginRight: 26,
  },
  thumbnail: {
    width: 98,
    height: 98,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  coverRight: {
    height: 98,
    position: 'absolute',
    right: -23,
    resizeMode: 'contain',
  },
  rightView: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
  },
  tab: {
    backgroundColor: '#fff',
  },
  summary: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  summaryText: {
    color: '#fff',
    fontSize: 12,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    borderRadius: 13,
    height: 26,
    width: 26,
    marginRight: 8,
  },
  name: {
    color: '#fff',
    fontSize: 12,
  },
});

function Wrapper(props: IProps) {
  const useheaderHeight = useHeaderHeight();
  return <Album headerHeight={useheaderHeight} {...props} />;
}

export default connector(Wrapper);
