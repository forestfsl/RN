/* eslint-disable react-native/no-inline-styles */
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import {
  MaterialTopTabBar,
  MaterialTopTabBarOptions,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LinearGradient from 'react-native-linear-gradient';
import LinearLinearGradientAnimatedGradient from 'react-native-linear-animated-gradient-transition';
import {connect, ConnectedProps} from 'react-redux';
import {getActiveRouteName} from '@/utils/index';

const mapStateToProps = (state: RootState, props: MaterialTopTabBarProps) => {
  // console.log('xxxxxxxx');
  // console.log(home.carousels);
  // console.log(home.carousels[home.activeCarouselIndex]);
  //如果爆出找不到colors，就先注释，成功之后再打开
  // return {
  //   undefined,
  // };
  // return {
  //   gradientVisible: home.gradientVisible,
  //   linearColors: home.carousels
  //     ? typeof home.carousels[home.activeCarouselIndex] === 'undefined'
  //       ? ['#ccc', '#e2e2e2']
  //       : home.carousels[home.activeCarouselIndex].colors
  //     : undefined,
  // };
  const routeName = getActiveRouteName(props.state);
  const modelState = state[routeName];
  return {
    gradientVisible: modelState.gradientVisible,
    linearColors:
      modelState.carousels && modelState.carousels.length > 0
        ? modelState.carousels[modelState.activeCarouselIndex]
          ? modelState.carousels[modelState.activeCarouselIndex].colors
          : undefined
        : undefined,
  };
};

const connector = connect(mapStateToProps);
type ModelState = ConnectedProps<typeof connector>;

type IProps = MaterialTopTabBarProps & ModelState;

class TopTabBarWrapper extends React.Component<IProps> {
  goCategory = () => {
    const {navigation} = this.props;
    navigation.navigate('Category');
  };
  get gradient() {
    const {gradientVisible, linearColors = ['#ccc', '#e2e2e2']} = this.props;
    if (gradientVisible) {
      return (
        <LinearLinearGradientAnimatedGradient
          colors={linearColors}
          style={styles.gradient}
        />
      );
    }
    return null;
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let {
      gradientVisible,
      indicatorStyle,
      inactiveTintColor,
      ...resetProps
    } = this.props;
    let textStyle = styles.blackText;
    let activeTintColor = '#333';
    if (gradientVisible) {
      textStyle = styles.text;
      activeTintColor = '#fff';
      if (indicatorStyle) {
        indicatorStyle = StyleSheet.compose(
          indicatorStyle,
          styles.whiteBackgroundColor,
        );
      }
    }
    return (
      <View style={styles.container}>
        {this.gradient}
        <View style={styles.topTabBarView}>
          <View style={styles.tabbar}>
            <MaterialTopTabBar
              {...resetProps}
              indicatorStyle={indicatorStyle}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              style={{backgroundColor: 'transparent'}}
            />
          </View>
          <Touchable style={styles.sortBtn} onPress={this.goCategory}>
            <Text style={textStyle}>分类</Text>
          </Touchable>
        </View>

        <View style={styles.searchBar}>
          <Touchable style={styles.search}>
            <Text style={textStyle}>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.history}>
            <Text style={textStyle}>历史记录</Text>
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
    paddingTop: getStatusBarHeight(),
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
  },
  tabbar: {
    flex: 1,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  search: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  history: {
    marginLeft: 24,
  },
  sortBtn: {
    paddingHorizontal: 8,
    borderLeftColor: '#eee',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: '#fff',
  },
  blackText: {
    color: '#333',
  },
  whiteBackgroundColor: {
    backgroundColor: '#fff',
  },
});

export default connector(TopTabBarWrapper);
