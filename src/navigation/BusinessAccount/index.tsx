import React from 'react';

import { useSelector } from '#hooks/redux';

import { createStackNavigator } from '@react-navigation/stack';

import {
  USABusinessAccountCU,
  USABusinessAccountR,
  BusinessAccountCU,
  BusinessAccountR,
} from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { BusinessAccountParamList, BusinessAccountRoutes } from './types';

const BusinessAccount = createStackNavigator<BusinessAccountParamList>();

const StackBusinessAccount = () => {
  const region = useSelector(store => store.app.region);
  return (
    <BusinessAccount.Navigator
      initialRouteName={BusinessAccountRoutes.CU}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <BusinessAccount.Screen
        component={region === 'RU' ? BusinessAccountCU : USABusinessAccountCU}
        name={BusinessAccountRoutes.CU}
      />
      <BusinessAccount.Screen
        component={region === 'RU' ? BusinessAccountR : USABusinessAccountR}
        name={BusinessAccountRoutes.R}
      />
    </BusinessAccount.Navigator>
  );
};

export default StackBusinessAccount;
