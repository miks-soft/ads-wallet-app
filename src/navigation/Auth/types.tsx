import { StackScreenProps } from '@react-navigation/stack';

export enum AuthRoutes {
  Start = 'Start',
  SignUp = 'SignUp',
  SignIn = 'SingIn',
}

export type AuthParamList = {
  [AuthRoutes.Start]: undefined;
  [AuthRoutes.SignUp]: undefined;
  [AuthRoutes.SignIn]: undefined;
};

export type AuthScreenProps<RouteName extends AuthRoutes> = StackScreenProps<
  AuthParamList,
  RouteName
>;
