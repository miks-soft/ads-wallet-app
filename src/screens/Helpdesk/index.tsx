import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  DrawerScreenProps,
  DrawerRoutes,
  MainRoutes,
  MainScreenProps,
} from '#navigation/Main/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetUserInfoQuery } from '#api/controllers/Auth';
import { useGetHelpdeskRequestsQuery } from '#api/controllers/Tracker';

import useErrorHandler from '#hooks/useErrorHandler';
import { useOnScrollPagination } from '#hooks/useOnScrollPagination';
import usePagination from '#hooks/usePagination';

import { DTOHelpdeskRequest } from '#generated/types';

import Layout from './layout';
import { HelpdeskQueryStatuses } from './types';

type NavigationProps = CompositeScreenProps<
  MainScreenProps<MainRoutes.Helpdesk>,
  CompositeScreenProps<
    AppScreenProps<AppRoutes>,
    DrawerScreenProps<DrawerRoutes>
  >
>;
const Container: React.FC<NavigationProps> = props => {
  const userInfoQuery = useGetUserInfoQuery();
  const [tab, setTab] = useState(HelpdeskQueryStatuses.open);
  const [page, setPage] = useState(1);

  const onScrollPagination = useOnScrollPagination();

  const helpdeskRequestsQuery = useGetHelpdeskRequestsQuery(
    {
      params: {
        status: tab,
        user_id: userInfoQuery.data?.id!,
        page,
        per_page: 15,
      },
    },
    {
      skip: !userInfoQuery.data?.id,
    },
  );

  const helpdeskPagination = usePagination({
    page,
    setPage,
    queryPage: helpdeskRequestsQuery.data?.current_page,
    lastPage: helpdeskRequestsQuery.data?.last_page,
    query: helpdeskRequestsQuery,
  });

  useErrorHandler(() => {}, helpdeskRequestsQuery);

  return (
    <Layout
      /**
       *Options
       */
      helpdeskRequests={helpdeskRequestsQuery.data?.data}
      isLoading={helpdeskPagination.loading}
      isRefreshing={helpdeskPagination.refreshing}
      tab={tab}
      /**
       *Methods
       */
      onFetchMore={onScrollPagination(helpdeskPagination.fetchMore)}
      onRefresh={helpdeskPagination.refresh}
      setTab={helpdeskPagination.resetDecorator(setTab)}
      {...props}
    />
  );
};

type PassingStates = {
  tab: HelpdeskQueryStatuses;
};

type PassingProps = {
  helpdeskRequests?: DTOHelpdeskRequest[];
  isRefreshing: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onFetchMore: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
