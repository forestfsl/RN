/* eslint-disable @typescript-eslint/no-unused-vars */
import Touchable from '@/components/Touchable';
import {IProgram} from '@/models/album';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from '@/assets/iconfont/index';

interface IProps {
  data: IProgram;
  index: number;
  onPress: (data: IProgram, index: number) => void;
}

class Item extends React.Component<IProps> {
  onPress = () => {
    const {onPress, data, index} = this.props;
    if (typeof onPress === 'function') {
      onPress(data, index);
    }
  };
  render() {
    const {data, index} = this.props;
    return (
      <Touchable style={styles.item} onPress={this.onPress}>
        <View style={styles.left}>
          <Text style={styles.serial}>{index + 1}</Text>
        </View>
        <View style={styles.centerView}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.centerRight}>
            <View style={styles.volumeView}>
              <Icon name="icon-V" color="#939393" />
              <Text style={styles.otherText}>{data.playVolume}</Text>
            </View>
            <View style={styles.duration}>
              <Icon name="icon-shengyin" color="#939393" />
              <Text style={styles.otherText}>{data.duration}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.date}>{data.date}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dedede',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  serial: {
    color: '#838383',
    fontWeight: '800',
  },
  title: {
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  centerView: {
    flex: 1,
    marginHorizontal: 25,
  },
  centerRight: {
    flexDirection: 'row',
  },
  volumeView: {
    flexDirection: 'row',
    marginRight: 10,
  },
  duration: {flexDirection: 'row'},
  otherText: {
    marginHorizontal: 5,
    color: '#939393',
    fontWeight: '100',
  },
  date: {
    color: '#939393',
    fontWeight: '100',
  },
});

export default Item;
