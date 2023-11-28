import React from 'react';

import { useSelector } from '#hooks/redux';

import {
  ObserversRoutes,
  ObserversScreenProps,
} from '#navigation/Observers/types';

import { useGetObserversQuery } from '#api/controllers/AdvertServicesObservers';

import { ImplementedAdvertisingServices } from '#config/enums';

import { DTOObserver } from '#generated/types';

import Layout from './layout';

type NavigationProps = ObserversScreenProps<ObserversRoutes.VK_ADS_LIST>;

const Container: React.FC<NavigationProps> = props => {
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const observersQuery = useGetObserversQuery(
    {
      params: {
        service: ImplementedAdvertisingServices.VKAds,
        business_account_id: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  return (
    <Layout
      /**
       *Options
       */
      isRefreshing={observersQuery.isLoading}
      observers={observersQuery.data}
      /**
       *Methods
       */
      onRefresh={observersQuery.refetch}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  observers?: DTOObserver[];
  isRefreshing: boolean;
  onRefresh: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
