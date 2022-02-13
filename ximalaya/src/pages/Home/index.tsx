/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {FlatList, View, ScrollView, ListRenderItemInfo} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import Carousel from './Carousel';
import Guess from './Guess';
import {Text} from 'react-native-svg';
import ChannelItem from './ChannelItem';
import {ICarousel, IChannel} from '@/models/home';

const mapStateToProps = ({home, loading}: RootState) => ({
  carousels: home.carousels,
  guess: home.guess,
  channels: home.channels,
  loading: loading.effects['home/fetchCarousel'],
});

const connector = connect(mapStateToProps);

type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {
  navigation: RootStackNavigation;
}

class Home extends React.Component<IProps> {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/fetchCarousel',
    });
    dispatch({
      type: 'home/fetchChannels',
    });
  }

  onPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Detail', {
      id: 100,
    });
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

  renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
    return <ChannelItem data={item} />;
  };

  get header() {
    const {carousels, channels} = this.props;
    return (
      <View>
        <Carousel data={carousels} />
        <Guess />
      </View>
    );
  }

  render() {
    const {carousels, channels} = this.props;
    // console.log(channels);
    // console.log(typeof channels);
    // console.log(typeof carousels);
    // console.log(channels.length);
    // console.log(carousels.length);
    return (
      <FlatList
        ListHeaderComponent={this.header}
        data={channels}
        renderItem={this.renderItem}
      />
    );
  }
}

export default connector(Home);
