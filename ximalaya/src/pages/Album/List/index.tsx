/* eslint-disable @typescript-eslint/no-unused-vars */
import {IProgram} from '@/models/album';
import {RootState} from '@/models/index';
import {itemWidth} from '@/pages/Category';
import React from 'react';
import Item from './Item';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';

const mapStateToProps = ({album}: RootState) => {
  return {
    list: album.list,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  nativeRef: React.RefObject<NativeViewGestureHandler>;
  tapRef: React.RefObject<TapGestureHandler>;
  panRef: React.RefObject<PanGestureHandler>;
  onScrollDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onItemPress: (item: IProgram, index: number) => void;
}

class List extends React.Component<IProps> {
  onPress = (data: IProgram, index: number) => {
    const {onItemPress} = this.props;
    onItemPress(data, index);
  };
  renderItem = ({item, index}: ListRenderItemInfo<IProgram>) => {
    return <Item data={item} index={index} onPress={this.onPress} />;
  };
  render() {
    const {list} = this.props;
    return (
      <FlatList
        style={styles.container}
        data={list}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default connector(List);
