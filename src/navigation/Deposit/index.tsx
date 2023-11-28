import React from 'react';

import { useSelector } from '#hooks/redux';

import { createStackNavigator } from '@react-navigation/stack';

import {
  DepositRUBusinessAccount,
  DepositUSABusinessAccount,
  DepositAdvertisingAccount,
} from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { DepositParamList, DepositRoutes } from './types';

const Deposit = createStackNavigator<DepositParamList>();

const StackDeposit = () => {
  const region = useSelector(store => store.app.region);
  return (
    <Deposit.Navigator
      initialRouteName={DepositRoutes.BusinessAccount}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Deposit.Screen
        component={
          region === 'RU' ? DepositRUBusinessAccount : DepositUSABusinessAccount
        }
        name={DepositRoutes.BusinessAccount}
      />
      <Deposit.Screen
        component={DepositAdvertisingAccount}
        name={DepositRoutes.AdvertisingAccount}
      />
    </Deposit.Navigator>
  );
};

export default StackDeposit;
