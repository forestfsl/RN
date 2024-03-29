/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {RootState} from '@/models/index';
import home, {ICarousel} from '@/models/home';
import {hp, viewportWidth, wp} from '@/utils/index';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import SnapCarousel, {
  AdditionalParallaxProps,
  Pagination,
  ParallaxImage,
} from 'react-native-snap-carousel';
import {connect, ConnectedProps} from 'react-redux';

// const data = [
//   'https://www.tanmizhi.com/img/882.jpg',
//   'https://www.tanmizhi.com/img/882.jpg',
//   'https://www.tanmizhi.com/img/882.jpg',
//   'https://www.tanmizhi.com/img/882.jpg',
// ];

const sliderWidth = viewportWidth;
const sideWidth = wp(90);
export const sideHeigt = hp(26);
const itemWidth = sideWidth + wp(2) * 0.2;

const mapStateToProps = ({home}: RootState) => ({
  data: home.carousels,
  activeCrouseIndex: home.activeCarouselIndex,
});

const connector = connect(mapStateToProps);

type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {}

class Carousel extends React.Component<IProps> {
  onSnapToItem = (index: number) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/setState',
      payload: {
        activeCarouselIndex: index,
      },
    });
  };

  renderItem = (
    {item}: {item: ICarousel},
    parallaxProps?: AdditionalParallaxProps,
  ) => {
    // console.log(item);
    // console.log(styles.image);
    return (
      <ParallaxImage
        source={{uri: item.image}}
        style={styles.image}
        containerStyle={styles.imageContainer}
        showSpinner
        spinnerColor="rgba(0,0,0,0.25)"
        {...parallaxProps}
      />
    );
  };

  get pagination() {
    const {data, activeCrouseIndex} = this.props;
    return (
      <View style={styles.paginationWrapper}>
        <Pagination
          containerStyle={styles.paginationContainer}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dot}
          activeDotIndex={activeCrouseIndex}
          dotsLength={data.length}
          inactiveDotScale={0.8}
          inactiveDotOpacity={0.4}
        />
      </View>
    );
  }
  render() {
    //   console.log(sliderWidth);
    // console.log(itemWidth);
    const {data} = this.props;
    return (
      <View>
        <SnapCarousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages
          onSnapToItem={this.onSnapToItem}
          loop
          autoplay
        />
        {this.pagination}
      </View>
    );
  }
}
//网络过来的地址，一定要有宽高的
const styles = StyleSheet.create({
  paginationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    top: -20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dotContainer: {
    marginHorizontal: 8,
  },
  imageContainer: {
    width: sideWidth,
    height: sideHeigt,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default connector(Carousel);
