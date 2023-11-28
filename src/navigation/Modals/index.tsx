import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  Actions,
  CreateGoogleAccount,
  CreateHelpdeskRequest,
  CreateMyTargetAccount,
  CreateRefundAdvertisingAccountBalance,
  CreateVkAccount,
  CreateVkAdsAccount,
  CreateYandexAccount,
  DatePicker,
  DialogModal,
  EditAdvertisingCampaignLimit,
  ListAdvertisingAccounts,
  ListBusinessAccounts,
  ListModal,
  RadioModal,
  SelectModal,
} from '#modals';

import { ModalsParamList, ModalsRoutes } from './types';

const Modals = createStackNavigator<ModalsParamList>();

const StackModals = () => {
  return (
    <Modals.Navigator
      initialRouteName={ModalsRoutes.ListBusinessAccounts}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Modals.Screen
        component={ListBusinessAccounts}
        name={ModalsRoutes.ListBusinessAccounts}
      />
      <Modals.Screen
        component={SelectModal}
        name={ModalsRoutes.Select}
      />
      <Modals.Screen
        component={CreateHelpdeskRequest}
        name={ModalsRoutes.CreateHelpdeskRequest}
      />
      <Modals.Screen
        component={Actions}
        name={ModalsRoutes.Actions}
      />
      <Modals.Screen
        component={DatePicker}
        name={ModalsRoutes.DatePicker}
      />
      <Modals.Screen
        component={CreateRefundAdvertisingAccountBalance}
        name={ModalsRoutes.CreateRefundAdvertisingAccountBalance}
      />

      <Modals.Screen
        component={ListModal}
        name={ModalsRoutes.List}
      />
      <Modals.Screen
        component={RadioModal}
        name={ModalsRoutes.RadioSelect}
      />
      <Modals.Screen
        component={CreateVkAccount}
        name={ModalsRoutes.CreateVkAccount}
      />
      <Modals.Screen
        component={CreateVkAdsAccount}
        name={ModalsRoutes.CreateVkAdsAccount}
      />
      <Modals.Screen
        component={CreateMyTargetAccount}
        name={ModalsRoutes.CreateMyTargetAccount}
      />
      <Modals.Screen
        component={CreateYandexAccount}
        name={ModalsRoutes.CreateYandexAccount}
      />
      <Modals.Screen
        component={CreateGoogleAccount}
        name={ModalsRoutes.CreateGoogleAccount}
      />
      <Modals.Screen
        component={EditAdvertisingCampaignLimit}
        name={ModalsRoutes.EditAdvertisingCampaignLimit}
      />
      <Modals.Screen
        component={ListAdvertisingAccounts}
        name={ModalsRoutes.ListAdvertisingAccounts}
      />
      <Modals.Screen
        component={DialogModal}
        name={ModalsRoutes.Dialog}
      />
    </Modals.Navigator>
  );
};

export default StackModals;
