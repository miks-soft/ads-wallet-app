import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as Keychain from 'react-native-keychain';
import RNRestart from 'react-native-restart';
import RNShake from 'react-native-shake';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { Query } from '#api';

import { __DEVELOPER__ } from '#config';

import { persistor } from '#store';
import { AppActions } from '#store/slices/app';

import { useDispatch, useSelector } from './redux';

const useListenShake = () => {
  const region = useSelector(store => store.app.region);
  const navigation = useNavigation<StackNavigationProp<AppParamList>>();
  const dispatch = useDispatch();

  const changeApp = () => {
    Keychain.resetGenericPassword();

    dispatch(Query.util.resetApiState());
    dispatch(AppActions.setCurrentBusinessAccountId(''));
    dispatch(AppActions.setSignedIn(false));
    dispatch(AppActions.setRegion(region === 'USA' ? 'RU' : 'USA'));
    persistor.flush();
    RNRestart.restart();
  };

  useEffect(() => {
    __DEVELOPER__ &&
      RNShake.addListener(() => {
        navigation.navigate(AppRoutes.Modals, {
          screen: ModalsRoutes.Actions,
          params: {
            buttons: [
              {
                type: 'primary',
                children: 'Change region',
                onPress: changeApp,
              },
            ],
          },
        });
      });

    return RNShake.removeAllListeners;
  }, []);
};

export default useListenShake;
