import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { BottomTabBar, Drawer as DrawerContent } from '#components';
import { Tab } from '#components/BottomTabBar/BottomTab';

import { Advertising, Documents, Events, Helpdesk, Statistics } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { STRINGS } from '#localization';

import {
  useGetIssuesQuery,
  useGetNewMessagesCountQuery,
} from '#api/controllers/Tracker';

import {
  MainParamList,
  MainRoutes,
  DrawerParamList,
  DrawerRoutes,
} from './types';

const Main = createBottomTabNavigator<MainParamList>();

const MainStack = (): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<MainParamList>>();
  const newMessagesQuery = useGetNewMessagesCountQuery();
  const t = STRINGS.BOTTOM_TAB_BAR;

  const tabs: Tab[] = [
    {
      onPress: () => navigation.navigate(MainRoutes.Events),
      label: t.tabEvents,
      screenName: MainRoutes.Events,
      iconName: 'calendar-today',
    },
    {
      onPress: () => navigation.navigate(MainRoutes.Statistics),
      label: t.tabStats,
      screenName: MainRoutes.Statistics,
      iconName: 'bar-diagram',
    },
    {
      onPress: () => navigation.navigate(MainRoutes.Documents),
      label: t.tabDocuments,
      screenName: MainRoutes.Documents,
      iconName: 'assignment',
    },
    {
      onPress: () => navigation.navigate(MainRoutes.Advertising),
      label: t.tabAdvertisment,
      screenName: MainRoutes.Advertising,
      iconName: 'trending-up',
    },
    {
      onPress: () => navigation.navigate(MainRoutes.Helpdesk),
      label: t.tabHelpdesk,
      //@ts-expect-error todo fix typings
      amount: newMessagesQuery?.data?.data || 0,
      screenName: MainRoutes.Helpdesk,
      iconName: 'help',
    },
  ];

  return (
    <Main.Navigator
      initialRouteName={MainRoutes.Events}
      screenOptions={DEFAULT_STACK_OPTIONS}
      tabBar={({ state }) => (
        <BottomTabBar
          focusIndex={state.index}
          tabs={tabs}
        />
      )}
    >
      <Main.Screen
        component={Events}
        name={MainRoutes.Events}
      />
      <Main.Screen
        component={Statistics}
        name={MainRoutes.Statistics}
      />
      <Main.Screen
        component={Documents}
        name={MainRoutes.Documents}
      />
      <Main.Screen
        component={Advertising}
        name={MainRoutes.Advertising}
      />
      <Main.Screen
        component={Helpdesk}
        name={MainRoutes.Helpdesk}
      />
    </Main.Navigator>
  );
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const StackDrawer = () => {
  /* Prefetch */
  useGetIssuesQuery();

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName={DrawerRoutes.Root}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Drawer.Screen
        component={MainStack}
        name={DrawerRoutes.Root}
      />
    </Drawer.Navigator>
  );
};

export default StackDrawer;
