/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Button,
  Text,
  View,
  ListRenderItemInfo,
  StyleSheet,
  Image,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import realm, {IProgram} from '@/config/realm';
import {FlatList} from 'react-native-gesture-handler';
import {itemWidth} from './Category';
import Icon from '@/assets/iconfont';
import {formatTime} from '../utils';

interface IProps {
  navigation: RootStackNavigation;
}

class Listen extends React.Component<IProps> {
  onPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Detail', {
      id: 100,
    });
  };

  renderItem = ({item}: ListRenderItemInfo<IProgram>) => {
    return (
      <View style={styles.item}>
        <Image source={{uri: item.thumbnailUrl}} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.bottom}>
            <Icon name="icon-time" color="#999" size={14} />
            <Text style={styles.text}>{formatTime(item.duration)}</Text>
            <Text style={styles.rate}>已播:{item.rate}%</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const programs = realm.objects<IProgram>('Program');
    return <FlatList data={programs} renderItem={this.renderItem} />;
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 3,
  },
  title: {
    color: '#999',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
  },
  text: {
    color: '#999',
    marginLeft: 5,
  },
  rate: {
    marginLeft: 10,
    color: '#f6a624',
  },
});

export default Listen;
