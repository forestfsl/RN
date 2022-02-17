/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  FlatList,
  View,
  ScrollView,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import Carousel from './Carousel';
import Guess from './Guess';
import {Text} from 'react-native';
import ChannelItem from './ChannelItem';
import {ICarousel, IChannel} from '@/models/home';

const mapStateToProps = ({home, loading}: RootState) => ({
  carousels: home.carousels,
  guess: home.guess,
  channels: home.channels,
  loading: loading.effects['home/fetchCarousel'],
  hasMore: home.pagination.hasMore,
});

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
    const {dispatch} = this.props;
    dispatch({
      type: 'home/fetchCarousel',
    });
    dispatch({
      type: 'home/fetchChannels',
    });
  }

  onPress = (data: IChannel) => {
    console.log(data);
    console.log('-----------------');
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
    return <ChannelItem data={item} onPress={this.onPress} />;
  };

  get header() {
    return (
      <View>
        <Carousel />
        <Guess />
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
    const {dispatch} = this.props;
    dispatch({
      type: 'home/fetchChannels',
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
    const {dispatch, loading, hasMore} = this.props;
    // console.log('----加载更多---');
    // console.log(hasMore);
    if (loading || !hasMore) {
      return;
    }
    dispatch({
      type: 'home/fetchChannels',
      payload: {
        loadMore: true,
      },
    });
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
  footerText: {
    fontSize: 16,
  },
});
export default connector(Home);
