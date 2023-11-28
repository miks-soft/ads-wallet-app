/**
 * @format
 */
import {
  AppRegistry,
  Platform,
  UIManager,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import { name as appName } from './app.json';

import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import App from './src/App';

import { IS_IOS } from '#styles';

StatusBar.setBarStyle('dark-content');
if (!IS_IOS) {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};

ScrollView.defaultProps = {
  ...(ScrollView.defaultProps || {}),
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
};

FlatList.defaultProps = {
  ...(FlatList.defaultProps || {}),
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
};

AppRegistry.registerComponent(appName, () => App);
