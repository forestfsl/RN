/* eslint-disable @typescript-eslint/no-unused-vars */
import {hp} from '@/utils/';
import {wp} from '@/utils/';
import {viewportWidth} from '@/utils/';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import SnapCarousel, {
  AdditionalParallaxProps,
} from 'react-native-snap-carousel';

const data = [
  'https://www.tanmizhi.com/img/882.jpg',
  'https://www.tanmizhi.com/img/882.jpg',
  'https://www.tanmizhi.com/img/882.jpg',
  'https://www.tanmizhi.com/img/882.jpg',
];

const sliderWidth = viewportWidth;
const sideWidth = wp(90);
const sideHeigt = hp(26);
const itemWidth = sideWidth + wp(2) * 0.2;

class Carousel extends React.Component {
  renderItem = (
    {item}: {item: string},
    parallaxProps?: AdditionalParallaxProps,
  ) => {
    // console.log(item);
    // console.log(styles.image);
    return <Image source={{uri: item}} style={styles.image} />;
  };
  render() {
    //   console.log(sliderWidth);
    //   console.log(itemWidth);
    return (
      <SnapCarousel
        data={data}
        renderItem={this.renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
      />
    );
  }
}
//网络过来的地址，一定要有宽高的
const styles = StyleSheet.create({
  image: {
    width: sideWidth,
    height: sideHeigt,
  },
});

export default Carousel;
