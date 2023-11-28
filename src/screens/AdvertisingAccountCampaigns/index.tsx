import React from 'react';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetAccountCampaignsQuery } from '#api/controllers/AdvertServices';

import useErrorHandler from '#hooks/useErrorHandler';

import { DTOAdvertAccountCampaign } from '#generated/types';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.AdvertisingAccountCampaigns>;

const Container: React.FC<NavigationProps> = props => {
  const campaignsQuery = useGetAccountCampaignsQuery(
    {
      params: {
        account_id: props.route.params.advertisingAccountId,
      },
    },
    {
      skip: !props.route.params.advertisingAccountId,
    },
  );

  useErrorHandler(() => {}, campaignsQuery);

  return (
    <Layout
      /**
       *Options
       */
      campaigns={campaignsQuery.data}
      isRefreshing={campaignsQuery.isFetching}
      /**
       *Methods
       */
      onRefresh={campaignsQuery.refetch}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  campaigns?: DTOAdvertAccountCampaign[];

  isRefreshing: boolean;
  onRefresh: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
