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
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = ({album}: RootState) => {
  return {
    list: album.list,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {}

class List extends React.Component<IProps> {
  onPress = (data: IProgram) => {};
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
