import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  DrawerScreenProps,
  DrawerRoutes,
  MainRoutes,
  MainScreenProps,
} from '#navigation/Main/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetDocumentsQuery } from '#api/controllers/Finance';

import { SortDirections } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import { useOnScrollPagination } from '#hooks/useOnScrollPagination';
import usePagination from '#hooks/usePagination';

import { DTOFinanceDocument } from '#generated/types';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  MainScreenProps<MainRoutes.Documents>,
  CompositeScreenProps<
    AppScreenProps<AppRoutes>,
    DrawerScreenProps<DrawerRoutes>
  >
>;
const Container: React.FC<NavigationProps> = props => {
  const currentBusinessAccountId = useSelector(
    state => state.app.currentBusinessAccountId,
  );

  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [sortDirection, setSortDirection] = useState(SortDirections.ASC);

  const [page, setPage] = useState(1);

  const documentsQuery = useGetDocumentsQuery(
    {
      params: {
        per_page: 20,
        page,
        business_account_id: currentBusinessAccountId,
        start_date: filterStartDate?.toISOString(),
        end_date: filterEndDate?.toISOString(),
        sort_dir: sortDirection,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  const documentsPagination = usePagination({
    page,
    setPage,
    queryPage: documentsQuery.data?.current_page,
    lastPage: documentsQuery.data?.last_page,
    query: documentsQuery,
  });

  const onScroll = useOnScrollPagination();

  const onRefresh = async () => documentsPagination.refresh();

  useErrorHandler(() => {}, documentsQuery);

  return (
    <Layout
      /**
       *Options
       */
      documents={documentsQuery.data}
      filterEndDate={filterEndDate}
      filterStartDate={filterStartDate}
      isLoading={documentsPagination.loading}
      isRefreshing={documentsPagination.refreshing}
      sortDirection={sortDirection}
      /**
       *Methods
       */
      onFetchMore={onScroll(documentsPagination.fetchMore)}
      onRefresh={onRefresh}
      setFilterEndDate={documentsPagination.resetDecorator(setFilterEndDate)}
      setFilterStartDate={documentsPagination.resetDecorator(
        setFilterStartDate,
      )}
      setSortDirection={setSortDirection}
      {...props}
    />
  );
};

type PassingStates = {
  sortDirection: SortDirections;
  filterStartDate?: Date;
  filterEndDate?: Date;
};

type PassingProps = {
  isLoading: boolean;
  isRefreshing: boolean;
  documents?: DTOFinanceDocument[];
  documentSum?: number;
  onRefresh: () => void;
  onFetchMore: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;
export default Container;
