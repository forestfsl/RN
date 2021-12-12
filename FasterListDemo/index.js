/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { StackNavigator } from 'react-navigation';

import FlatListDemo from "./pages/FlatListDemo";

import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);
