import React from 'react';

import {
  BusinessAccountRoutes,
  BusinessAccountScreenProps,
} from '#navigation/BusinessAccount/types';

import { useGetUserInfoQuery } from '#api/controllers/Auth';
import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';

import { DTOBusinessAccount, DTOUserinfo } from '#generated/types';

import Layout from './layout';

type NavigationProps = BusinessAccountScreenProps<BusinessAccountRoutes.R>;

const Container: React.FC<NavigationProps> = props => {
  const userInfoQuery = useGetUserInfoQuery();
  const businessAccountQuery = useGetBusinessAccountQuery({
    path: {
      business_account: props.route.params.accountId,
    },
  });

  return (
    <Layout
      /**
       *Options
       */
      businessAccount={businessAccountQuery.data}
      isLoading={businessAccountQuery.isLoading || userInfoQuery.isLoading}
      userInfo={userInfoQuery.data}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isLoading: boolean;
  businessAccount?: DTOBusinessAccount;
  userInfo?: DTOUserinfo;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
