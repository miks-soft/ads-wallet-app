import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  ObserversVKList,
  ObserversVKCRUD,
  ObserversVKAdsList,
  ObserversVKAdsCRUD,
} from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { ObserversParamList, ObserversRoutes } from './types';

const Observers = createStackNavigator<ObserversParamList>();

const StackObservers = () => {
  return (
    <Observers.Navigator
      initialRouteName={ObserversRoutes.VK_LIST}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Observers.Screen
        component={ObserversVKList}
        name={ObserversRoutes.VK_LIST}
      />
      <Observers.Screen
        component={ObserversVKCRUD}
        name={ObserversRoutes.VK_CRUD}
      />
      <Observers.Screen
        component={ObserversVKAdsList}
        name={ObserversRoutes.VK_ADS_LIST}
      />
      <Observers.Screen
        component={ObserversVKAdsCRUD}
        name={ObserversRoutes.VK_ADS_CRUD}
      />
    </Observers.Navigator>
  );
};

export default StackObservers;
