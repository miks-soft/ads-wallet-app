import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  RestorePasswordEmail,
  RestorePasswordCode,
  RestorePasswordMain,
} from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { RestorePasswordParamList, RestorePasswordRoutes } from './types';

const RestorePassword = createStackNavigator<RestorePasswordParamList>();

const StackRestorePassword = () => {
  return (
    <RestorePassword.Navigator
      initialRouteName={RestorePasswordRoutes.Main}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <RestorePassword.Screen
        component={RestorePasswordEmail}
        name={RestorePasswordRoutes.Email}
      />
      <RestorePassword.Screen
        component={RestorePasswordCode}
        name={RestorePasswordRoutes.Code}
      />
      <RestorePassword.Screen
        component={RestorePasswordMain}
        name={RestorePasswordRoutes.Main}
      />
    </RestorePassword.Navigator>
  );
};

export default StackRestorePassword;
