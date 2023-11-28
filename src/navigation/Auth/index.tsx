import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { SignUp, SignIn } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { AuthParamList, AuthRoutes } from './types';

const Auth = createStackNavigator<AuthParamList>();

const StackAuth = () => {
  return (
    <Auth.Navigator
      initialRouteName={AuthRoutes.SignIn}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Auth.Screen
        component={SignUp}
        name={AuthRoutes.SignUp}
      />
      <Auth.Screen
        component={SignIn}
        name={AuthRoutes.SignIn}
      />
    </Auth.Navigator>
  );
};

export default StackAuth;
