/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {PureComponent} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {navigate, viewportWidth} from '@/utils/index';
import {RootState} from '@/models/index';
import Play from './Play';
import {RootStackNavigation} from '@/navigator/index';

const viewWidth = 50;

const mapStateToProps = ({player}: RootState) => ({
  playState: player.playState,
});

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  activeScreenName: string;
}

/**
 * 播放按钮外套
 */
class PlayView extends PureComponent<IProps> {
  onPress = () => {
    console.log('点击了中心按钮');
    navigate('ListDetail', {id: 123});
  };
  render() {
    const {playState, activeScreenName} = this.props;
    if (playState !== 'playing') {
      return null;
    }
    if (
      activeScreenName.indexOf('tab-') > -1 ||
      activeScreenName === 'Listen' ||
      activeScreenName === 'ListDetail' ||
      activeScreenName === 'HomeTabs' ||
      activeScreenName === 'Found' ||
      activeScreenName === 'Account'
    ) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Play onPress={this.onPress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: viewWidth,
    height: viewWidth + 20,
    position: 'absolute',
    bottom: 10,
    left: (viewportWidth - viewWidth) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    padding: 10,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 0.85,
        shadowRadius: 5,
        shadowOffset: {
          width: StyleSheet.hairlineWidth,
          height: StyleSheet.hairlineWidth,
        },
      },
    }),
  },
});

export default connect(mapStateToProps)(PlayView);
