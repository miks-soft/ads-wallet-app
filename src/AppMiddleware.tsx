import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { useDispatch, useSelector } from '#hooks/redux';

import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

// eslint-disable-next-line no-restricted-imports
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { H5 } from '#ui-kit/Text';
import moment from 'moment';

import ToastProvider from '#components/providers/ToastProvider';

import RootStack from '#navigation';

import { Query } from '#api';
import { TagsApiTracker } from '#api/controllers/Tracker/types';

import { __DEVELOPER__ } from '#config';

import { RU_colors, USA_colors } from '#styles/theme';
import ThemeProvider from '#styles/theme/ThemeProvider';

import { ENUMS, STRINGS } from './localization';

import 'moment/locale/ru';

const AppMiddleware = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<undefined | string>('');
  const isSignedIn = useSelector(store => store.app.signedIn);
  const dispatch = useDispatch();
  const region = useSelector(store => store.app.region);

  useEffect(() => {
    if (region === 'RU') {
      STRINGS.setLanguage('ru');
      ENUMS.setLanguage('ru');
      moment.locale('ru');
    } else {
      STRINGS.setLanguage('en');
      ENUMS.setLanguage('en');
      moment.locale('en');
    }
  }, [region]);

  return (
    <ThemeProvider
      key={region}
      colors={region === 'USA' ? USA_colors : RU_colors}
    >
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
          },
        }}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName && isSignedIn) {
            routeNameRef.current = currentRouteName;

            dispatch(
              Query.util.invalidateTags([TagsApiTracker.MESSAGES_COUNT]),
            );
          }
        }}
      >
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaProvider>
            {__DEVELOPER__ && (
              <SafeAreaView
                pointerEvents="none"
                style={styles.developerBuildLabelContainer}
              >
                <H5
                  color="green"
                  textAlign="right"
                >
                  DEV. MODE
                </H5>
              </SafeAreaView>
            )}
            <RootStack />
            <ToastProvider />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  developerBuildLabelContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    right: 16,
  },
});

export default AppMiddleware;
