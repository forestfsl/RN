/* eslint-disable @typescript-eslint/no-unused-vars */
import {IChannel} from '@/models/home';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from '@/assets/iconfont/index';
import Touchable from '@/components/Touchable';

interface IProps {
  data: IChannel;
  onPress: (data: IChannel) => void;
}

class ChannelItem extends React.Component<IProps> {
  //业务代码分离，调用父组件的函数即可
  onPress = () => {
    const {onPress, data} = this.props;
    console.log('点击了按钮');
    if (typeof onPress === 'function') {
      onPress(data);
    }
  };
  render() {
    const {data} = this.props;
    return (
      <Touchable onPress={this.onPress}>
        <View style={styles.container}>
          <Image source={{uri: data.image}} style={styles.image} />
          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>
            <Text style={styles.remark} numberOfLines={2}>
              {data.remark}
            </Text>
            <View style={styles.bottom}>
              <View style={styles.playView}>
                <Icon name="icon-V" size={14} />
                <Text style={styles.number}>{data.played}</Text>
              </View>
              <View style={styles.playingView}>
                <Icon name="icon-shengyin" size={14} />
                <Text style={styles.number}>{data.playing}</Text>
              </View>
            </View>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#ccc',
    textShadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#dedede',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  remark: {
    backgroundColor: '#f8f8f8',
    padding: 5,
    marginBottom: 5,
  },
  bottom: {
    flexDirection: 'row',
  },
  playView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  playingView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    marginLeft: 5,
  },
});

export default ChannelItem;
