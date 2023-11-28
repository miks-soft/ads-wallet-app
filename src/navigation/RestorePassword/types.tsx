import { StackScreenProps } from '@react-navigation/stack';

export enum RestorePasswordRoutes {
  Email = 'RestorePasswordEmail',
  Code = 'RestorePasswordCode',
  Main = 'RestorePasswordMain',
}

export type RestorePasswordParamList = {
  [RestorePasswordRoutes.Email]: undefined;
  [RestorePasswordRoutes.Code]: { email: string };
  [RestorePasswordRoutes.Main]: { email: string; code: string };
};

export type RestorePasswordScreenProps<
  RouteName extends RestorePasswordRoutes,
> = StackScreenProps<RestorePasswordParamList, RouteName>;
