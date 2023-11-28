import { DrawerScreenProps as _DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export enum MainRoutes {
  Advertising = 'Advertising',
  Events = 'Events',
  Documents = 'Documents',
  Helpdesk = 'Helpdesk',
  Statistics = 'Statistics',
  StubNoBusinessAccount = 'StubNoBusinessAccount',
}

export type MainParamList = {
  [MainRoutes.Advertising]: undefined;
  [MainRoutes.Events]: undefined;
  [MainRoutes.Documents]: undefined;
  [MainRoutes.Helpdesk]: undefined;
  [MainRoutes.Statistics]: undefined;
  [MainRoutes.StubNoBusinessAccount]: undefined;
};

export type MainScreenProps<RouteName extends MainRoutes> = StackScreenProps<
  MainParamList,
  RouteName
>;

export enum DrawerRoutes {
  Root = '_ROOT',
}

export type DrawerParamList = {
  [DrawerRoutes.Root]: NavigatorScreenParams<MainParamList>;
};

export type DrawerScreenProps<RouteName extends DrawerRoutes> =
  _DrawerScreenProps<DrawerParamList, RouteName>;
