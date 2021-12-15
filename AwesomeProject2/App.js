/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
  },
});

export default App;
