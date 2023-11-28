import React from 'react';

import {
  BusinessAccountRoutes,
  BusinessAccountScreenProps,
} from '#navigation/BusinessAccount/types';

import { useResetClientSecretMutation } from '#api/controllers/BusinessAccounts';

import useErrorHandler from '#hooks/useErrorHandler';

import { DTOBusinessAccount, DTOUserinfo } from '#generated/types';

import Layout from './layout';

type NavigationProps = BusinessAccountScreenProps<BusinessAccountRoutes.R> & {
  businessAccount?: DTOBusinessAccount;
  userInfo?: DTOUserinfo;
};

const Container: React.FC<NavigationProps> = props => {
  const [resetClientSecret, resetClientSecretMeta] =
    useResetClientSecretMutation({});

  const onResetClientSecret = async () => {
    resetClientSecret({
      path: {
        business_account: props.route.params.accountId,
      },
    });
  };

  useErrorHandler(() => {}, resetClientSecretMeta);

  return (
    <Layout
      /**
       *Options
       */
      isResetingSecret={resetClientSecretMeta.isLoading}
      /**
       *Methods
       */
      onResetClientSecret={onResetClientSecret}
      {...props}
      businessAccount={resetClientSecretMeta.data || props.businessAccount}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isResetingSecret: boolean;
  onResetClientSecret: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
