import React from 'react';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useGetUserInfoQuery, useLogoutMutation } from '#api/controllers/Auth';
import { useResendEmailVerificationMutation } from '#api/controllers/Registration';

import ToastService from '#services/ToastService';

import useErrorHandler from '#hooks/useErrorHandler';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.StubNotVerified>;

const Container: React.FC<NavigationProps> = props => {
  const [logout, logoutMeta] = useLogoutMutation();
  const [resendEmail, resendEmailMeta] = useResendEmailVerificationMutation({});
  const userInfoQuery = useGetUserInfoQuery();

  const onLogout = () => {
    logout();
  };

  const onResendEmail = async () => {
    try {
      await resendEmail({
        data: { email: userInfoQuery?.data?.email! },
      }).unwrap();

      ToastService.success(
        STRINGS.SCREEN_STUBS_NOT_VERIFIED.toastResendSuccess,
      );
    } catch (e) {}
  };

  useErrorHandler(() => {}, logoutMeta);
  useErrorHandler(() => {}, resendEmailMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={resendEmailMeta.isLoading}
      isLoggingOut={logoutMeta.isLoading}
      /**
       *Methods
       */
      onLogout={onLogout}
      onResendEmail={onResendEmail}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isLoading: boolean;
  isLoggingOut: boolean;

  onLogout: () => void;
  onResendEmail: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
