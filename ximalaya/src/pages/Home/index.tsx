/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  FlatList,
  View,
  ScrollView,
  ListRenderItemInfo,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import Carousel, {sideHeigt} from './Carousel';
import Guess from './Guess';
import {Text} from 'react-native';
import ChannelItem from './ChannelItem';
import {ICarousel, IChannel, IGUESS} from '@/models/home';
import {RouteProp} from '@react-navigation/native';
import {HomeParamList} from '@/navigator/HomeTabs';

const mapStateToProps = (
  state: RootState,
  {route}: {route: RouteProp<HomeParamList, string>},
) => {
  const {namespace} = route.params;
  const modelState = state[namespace];
  return {
    namespace,
    carousels: modelState.carousels,
    guess: modelState.guess,
    channels: modelState.channels,
    loading: state.loading.effects[namespace + '/fetchCarousel'],
    hasMore: modelState.pagination.hasMore,
    gradientVisible: modelState.gradientVisible,
  };
};

const connector = connect(mapStateToProps);

type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {
  navigation: RootStackNavigation;
}

interface IState {
  refreshing: boolean;
}

class Home extends React.Component<IProps, IState> {
  state = {
    refreshing: false,
  };
  componentDidMount() {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchCarousel',
    });
    dispatch({
      type: namespace + '/fetchChannels',
    });
  }

  goAlbum = (data: IChannel | IGUESS) => {
    console.log(data);
    console.log('-----------------');
    const {navigation} = this.props;
    navigation.navigate('Album', {item: data});
  };

  add = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/add',
      payload: {
        num: 10,
      },
    });
  };

  asyncAdd = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/asyncAdd',
      payload: {
        num: 2,
      },
    });
  };

  //帮助函数生成一个不重复的key，可以指定刷新的key，减少重复的key
  keyExtractor = (item: IChannel) => {
    return item.id;
  };

  renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
    return <ChannelItem data={item} onPress={this.goAlbum} />;
  };

  get header() {
    const {namespace} = this.props;
    return (
      <View>
        <Carousel />
        <View style={styles.background}>
          <Guess namespace={namespace} goAlbum={this.goAlbum} />
        </View>
      </View>
    );
  }

  get footer() {
    const {hasMore, loading, channels} = this.props;
    console.log(hasMore, loading);
    console.log('footer---------');
    if (!hasMore) {
      return (
        <View style={styles.end}>
          <Text>--我是有底线的--</Text>
        </View>
      );
    }
    if (loading && hasMore && channels.length > 0) {
      return (
        <View style={styles.loading}>
          <Text>正在加载中</Text>
        </View>
      );
    }
  }

  get empty() {
    const {loading} = this.props;
    if (loading) {
      return;
    }
    return (
      <View style={styles.empty}>
        <Text>暂无数据</Text>
      </View>
    );
  }
  //刷新
  onRefresh = () => {
    //1.修改刷新状态为ture:
    this.setState({
      refreshing: true,
    });
    //2.获取数据
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchChannels',
      callback: () => {
        //3.修改刷新状态为false
        this.setState({
          refreshing: false,
        });
      },
    });
  };

  //加载更多
  onEndReached = () => {
    const {dispatch, loading, hasMore, namespace} = this.props;
    // console.log('----加载更多---');
    // console.log(hasMore);
    if (loading || !hasMore) {
      return;
    }
    dispatch({
      type: namespace + '/fetchChannels',
      payload: {
        loadMore: true,
      },
    });
  };

  onsScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;
    let newGradientVisible = offsetY < sideHeigt;
    const {dispatch, gradientVisible, namespace} = this.props;
    if (gradientVisible !== newGradientVisible) {
      dispatch({
        type: namespace + '/setState',
        payload: {
          gradientVisible: newGradientVisible,
        },
      });
    }
  };

  render() {
    const {carousels, channels} = this.props;
    const {refreshing} = this.state;
    // console.log(channels);
    // console.log(typeof channels);
    // console.log(typeof carousels);
    // console.log(channels.length);
    // console.log(carousels.length);
    return (
      <FlatList
        ListHeaderComponent={this.header}
        ListFooterComponent={this.footer}
        ListEmptyComponent={this.empty}
        data={channels}
        // data={[]} 测试暂无数据的
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.2}
        onScroll={this.onsScroll}
      />
    );
  }
}

const styles = StyleSheet.create({
  end: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  background: {
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 16,
  },
});
export default connector(Home);
