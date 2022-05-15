/* eslint-disable @typescript-eslint/no-unused-vars */
import Touchable from '@/components/Touchable';
import {Formik} from 'formik';
import React from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../models';
interface Values {
  account: string;
  password: string;
}

const initialValues = {
  account: '',
  password: '',
};

const mapStateToProps = ({loading}: RootState) => {
  return {
    loading: loading.effects['user/login'],
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

class Login extends React.Component<ModelState> {
  onSubmit = (values: Values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/login',
      payload: values,
    });
  };
  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>听书</Text>
        <Formik initialValues={initialValues} onSubmit={this.onSubmit}>
          {({values, handleChange, handleBlur, handleSubmit}) => {
            return (
              <View>
                <TextInput
                  onChangeText={handleChange('account')}
                  onBlur={handleBlur('account')}
                  value={values.account}
                />
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
                <Touchable onPress={handleSubmit}>
                  <Text>登录</Text>
                </Touchable>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    color: '#ff4000',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default connector(Login);
