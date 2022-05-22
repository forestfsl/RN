/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import {Image, StyleSheet, Text, View} from 'react-native';
import Touchable from '@/components/Touchable';
import defaultAvatarImg from '@/assets/default_avatar.png';
import {navigate} from '@/utils/index';

interface IProps {
  authority: Boolean;
  noMatch?: () => JSX.Element;
}

class Authorized extends React.Component<IProps> {
  onPress = () => {
    navigate('Login');
  };

  codePush = () => {
    navigate('CodePushPage');
  };

  render() {
    const {children, authority, noMatch} = this.props;
    if (authority) {
      console.log('authority', authority);
      return children;
    }
    return this.renderNoMatch();
  }

  renderNoMatch = () => {
    console.log('renderNoMatch', this.props.noMatch);
    if (this.props.noMatch) {
      console.log('进入垃圾');
      return <View>{this.props.noMatch()}</View>;
    }
    console.log('登录后自动同步所有记录哦~');
    return (
      <View style={styles.loginView}>
        <Image source={defaultAvatarImg} style={styles.avatar} />
        <View style={styles.right}>
          <Touchable style={styles.loginBtn} onPress={this.onPress}>
            <Text style={styles.loginBtnText}>立即登录</Text>
          </Touchable>
          <Touchable style={styles.loginBtn} onPress={this.codePush}>
            <Text style={styles.loginBtnText}>codePush</Text>
          </Touchable>
          <Text style={styles.tip}>登录后自动同步所有记录哦~</Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  loginView: {
    flexDirection: 'row',
    margin: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  right: {
    flex: 1,
    marginLeft: 15,
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    width: 76,
    borderRadius: 13,
    borderColor: '#f85442',
    borderWidth: 1,
    marginBottom: 12,
  },
  loginBtnText: {
    color: '#f85442',
    fontWeight: '900',
  },
  tip: {
    color: '#999',
  },
});

export default Authorized;
