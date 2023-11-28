import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { useSelector } from '#hooks/redux';

import { createStackNavigator } from '@react-navigation/stack';

import RNBootSplash from 'react-native-bootsplash';

import {
  AddMyTargetAccountGuide,
  AddVKAdsAccountGuide,
  AdvertisingAccountCampaigns,
  CashbackAndCommission,
  HelpdeskChat,
  StubNoBussinessAccount,
  StubNotVerified,
} from '#screens';

import { useGetUserInfoQuery } from '#api/controllers/Auth';
import { useGetBusinessAccountsQuery } from '#api/controllers/BusinessAccounts';

import useListenShake from '#hooks/useListenShake';

import { delay } from '#utils';

import StackAuth from './Auth';
import StackBusinessAccount from './BusinessAccount';
import { DEFAULT_STACK_OPTIONS } from './config';
import StackDeposit from './Deposit';
import StackDrawer from './Main';
import StackModals from './Modals';
import StackObservers from './Observers';
import StackRestorePassword from './RestorePassword';
import { AppParamList, AppRoutes } from './types';

const Wrapper = createStackNavigator();
const App = createStackNavigator<AppParamList>();

const RootStack = (): React.ReactElement => {
  useListenShake();

  return (
    <Wrapper.Navigator
      initialRouteName="App"
      screenOptions={{ headerShown: false }}
    >
      <Wrapper.Screen
        component={AppStack}
        name="App"
      />
    </Wrapper.Navigator>
  );
};

const AppStack = () => {
  const isSignedIn = useSelector(store => store.app.signedIn);
  const stubs = useSelector(store => store.app.stubs);

  useGetUserInfoQuery(undefined, {
    skip: !isSignedIn,
    refetchOnMountOrArgChange: true,
  });

  useGetBusinessAccountsQuery(
    //@ts-expect-error TODO FIX DOCS
    {
      params: {
        page: 1,
        per_page: 20,
      },
    },
    { skip: !isSignedIn || stubs.notVerified, refetchOnMountOrArgChange: true },
  );

  const hideSplash = async () => {
    await delay(250);
    RNBootSplash.hide({ fade: true, duration: 500 });
    StatusBar.setBarStyle('dark-content');
  };

  useEffect(() => {
    hideSplash();
  }, []);

  return (
    <App.Navigator
      initialRouteName={AppRoutes.Main}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      {isSignedIn ? (
        <>
          {stubs?.notVerified && (
            <App.Screen
              component={StubNotVerified}
              name={AppRoutes.StubNotVerified}
              options={{
                gestureEnabled: false,
              }}
            />
          )}

          {stubs?.noBusinessAccount && (
            <App.Screen
              component={StubNoBussinessAccount}
              name={AppRoutes.StubNoBusinessAccount}
              options={{
                gestureEnabled: false,
              }}
            />
          )}

          {Object.values(stubs).filter(el => el).length === 0 && (
            <App.Screen
              component={StackDrawer}
              name={AppRoutes.Main}
              options={{
                gestureEnabled: false,
              }}
            />
          )}
        </>
      ) : (
        <App.Screen
          component={StackAuth}
          name={AppRoutes.StackAuth}
        />
      )}

      <App.Screen
        component={StackRestorePassword}
        name={AppRoutes.StackRestorePassword}
      />

      <App.Screen
        component={StackBusinessAccount}
        name={AppRoutes.StackBusinessAccount}
      />

      <App.Screen
        component={StackDeposit}
        name={AppRoutes.StackDeposit}
      />

      <App.Screen
        component={StackObservers}
        name={AppRoutes.StackObservers}
      />

      <App.Screen
        component={AddMyTargetAccountGuide}
        name={AppRoutes.AddMyTargetAccountGuide}
      />

      <App.Screen
        component={AddVKAdsAccountGuide}
        name={AppRoutes.AddVKAdsAccountGuide}
      />

      <App.Screen
        component={AdvertisingAccountCampaigns}
        name={AppRoutes.AdvertisingAccountCampaigns}
      />

      <App.Screen
        component={HelpdeskChat}
        name={AppRoutes.HelpdeskChat}
      />

      <App.Screen
        component={CashbackAndCommission}
        name={AppRoutes.CashbackAndCommission}
      />

      <App.Screen
        component={StackModals}
        name={AppRoutes.Modals}
        options={{
          headerShown: false,
          detachPreviousScreen: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: () => ({}),
        }}
      />
    </App.Navigator>
  );
};

export default RootStack;
