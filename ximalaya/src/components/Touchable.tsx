/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';

const Touchable: React.FC<TouchableOpacityProps> = React.memo(props => {
  const {style, onPress, disabled, ...rest} = props;
  const disabledStyle = disabled && styles.disabled;
  let throttleOnPress;
  if (typeof onPress === 'function') {
    throttleOnPress = useCallback(
      _.throttle(onPress, 1000, {
        leading: true,
        trailing: false,
      }),
      [onPress],
    );
  }
  return (
    <TouchableOpacity
      onPress={throttleOnPress}
      disabled={disabled}
      style={[style, disabledStyle]}
      activeOpacity={0.8}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default Touchable;
