/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '@/models/index';
import Touchable from '@/components/Touchable';
import {IGUESS} from '@/models/home';
import Icon from '@/assets/iconfont/index';

const mapStateToProps = ({home}: RootState) => {
  return {
    guess: home.guess,
  };
};
const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  namespace: string;
  goAlbum: (item: IGUESS) => void;
}

class Guess extends React.Component<IProps> {
  componentDidMount() {
    this.fetch();
  }

  changeBatch = () => {
    this.fetch();
  };

  fetch = () => {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchGuess',
    });
  };
  renderItem = ({item}: {item: IGUESS}) => {
    // console.log(item);
    const {goAlbum} = this.props;
    return (
      <Touchable
        style={styles.item}
        onPress={() => {
          goAlbum(item);
        }}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text numberOfLines={2}>{item.title}</Text>
      </Touchable>
    );
  };
  render() {
    const {guess} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="icon-xihuan" />
            <Text style={styles.headerTitle}>猜你喜欢我</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.moreTitle}>更多</Text>
            <Icon name="icon-more" />
          </View>
        </View>
        <FlatList
          style={styles.list}
          numColumns={3}
          data={guess}
          renderItem={this.renderItem}
        />
        <Touchable onPress={this.changeBatch} style={styles.changeBatch}>
          <Text>
            <Icon name="icon-huanyipi" size={14} color="red" /> 换一批
          </Text>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  item: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerTitle: {
    marginLeft: 5,
    color: '#333333',
  },
  moreTitle: {
    color: '#6f6f6f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: '#efefef',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    // textAlign: "center"
  },
  changeBatch: {
    padding: 10,
    alignItems: 'center',
  },
  list: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
});

export default connector(Guess);
