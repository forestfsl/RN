/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {RootState} from '@/models/index';
import albumModel from '@/models/album';
import {ConnectedProps, connect} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@/navigator/index';
import coverRight from '@/assets/cover-right.png';
import {BlurView} from '@react-native-community/blur';
import Tab from './Tab';

const mapStateToProps = ({album}: RootState) => {
  return {
    summary: album.summary,
    author: album.author,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  headerHeight: number;
  route: RouteProp<RootStackParamList, 'Album'>;
}

class Album extends React.Component<IProps> {
  componentDidMount() {
    const {dispatch, route} = this.props;
    const {id} = route.params.item;
    dispatch({
      type: 'album/fetchAlbum',
      payload: {
        id,
      },
    });
  }

  renderHeader = () => {
    const {headerHeight, summary, author, route} = this.props;
    const {title, image} = route.params.item;
    // console.log(headerHeight);
    console.log(author.avatar);
    return (
      <View style={[styles.header, {paddingTop: headerHeight}]}>
        <Image source={{uri: image}} style={styles.background} />
        <BlurView
          blurType="light"
          blurAmount={5}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.leftView}>
          <Image source={{uri: image}} style={styles.thumbnail} />
          <Image source={coverRight} style={styles.coverRight} />
        </View>
        <View style={styles.rightView}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.summary}>
            <Text numberOfLines={1} style={styles.summaryText}>
              {summary}
            </Text>
          </View>
          <View style={styles.author}>
            <Image source={{uri: author.avatar}} style={styles.avatar} />
            <Text style={styles.name}>{author.name}</Text>
          </View>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <Tab />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 260,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#eee',
  },
  leftView: {
    marginRight: 26,
  },
  thumbnail: {
    width: 98,
    height: 98,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  coverRight: {
    height: 98,
    position: 'absolute',
    right: -23,
    resizeMode: 'contain',
  },
  rightView: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
  },
  summary: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  summaryText: {
    color: '#fff',
    fontSize: 12,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    borderRadius: 13,
    height: 26,
    width: 26,
    marginRight: 8,
  },
  name: {
    color: '#fff',
    fontSize: 12,
  },
});

function Wrapper(props: IProps) {
  const useheaderHeight = useHeaderHeight();
  return <Album headerHeight={useheaderHeight} {...props} />;
}

export default connector(Wrapper);
