import React from 'react';
import {View} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import Carousel from './Carousel';
import Guess from './Guess';
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = ({home, loading}: RootState) => ({
  carousels: home.carousels,
  guess: home.guess,
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

  render() {
    const {carousels} = this.props;
    return (
      <ScrollView>
        <Carousel data={carousels} />
        <Guess />
      </ScrollView>
    );
  }
}

export default connector(Home);
