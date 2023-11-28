import React, { useEffect } from 'react';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useLogoutMutation } from '#api/controllers/Auth';
import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';

import useErrorHandler from '#hooks/useErrorHandler';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.StubNoBusinessAccount>;

const StubNoBussinessAccountContainer: React.FC<NavigationProps> = props => {
  const [logout, logoutMeta] = useLogoutMutation();

  const businessAccountQuery = useGetBusinessAccountQuery({
    path: {
      //todo fix docs
      business_account: '',
    },
    params: {
      page: 1,
      per_page: 20,
    },
  });

  const onLogout = () => {
    logout();
  };

  const getBusinessAccounts = async () => {
    try {
      businessAccountQuery.refetch();
    } catch (e) {}
  };

  useEffect(() => {
    getBusinessAccounts();
  }, []);

  useErrorHandler(() => {}, logoutMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoggingOut={logoutMeta.isLoading}
      /**
       *Methods
       */
      onLogout={onLogout}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default StubNoBussinessAccountContainer;
