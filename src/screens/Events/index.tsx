import React, { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { useDispatch, useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  MainScreenProps,
  DrawerScreenProps,
  DrawerRoutes,
  MainRoutes,
} from '#navigation/Main/types';
import { AppScreenProps, AppRoutes } from '#navigation/types';

import { Query } from '#api';
import { useGetBusinessAccountsTransactionsQuery } from '#api/controllers/BusinessAccounts';
import { TagsApiBusinessAccounts } from '#api/controllers/BusinessAccounts/types';

import DateFormatter from '#services/formatters/Date';

import useDebouncedState from '#hooks/useDebouncedState';
import useErrorHandler from '#hooks/useErrorHandler';
import { useOnScrollPagination } from '#hooks/useOnScrollPagination';
import usePagination from '#hooks/usePagination';

import { DTOTransaction } from '#generated/types';

import Layout from './layout';
import { EventIdTypes } from './types';

type NavigationProps = CompositeScreenProps<
  MainScreenProps<MainRoutes.Events>,
  CompositeScreenProps<
    AppScreenProps<AppRoutes>,
    DrawerScreenProps<DrawerRoutes>
  >
>;

const Container: React.FC<NavigationProps> = props => {
  const dispatch = useDispatch();
  const currentBusinessAccountId = useSelector(
    state => state.app.currentBusinessAccountId,
  );

  const [filterByEvent, setFilterByEvent] = useState<
    EventIdTypes | undefined
  >();
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchFor, setSearchFor, debouncedSearchFor] = useDebouncedState('');

  const [page, setPage] = useState(1);

  const transactionsQuery = useGetBusinessAccountsTransactionsQuery(
    {
      path: {
        business_account: currentBusinessAccountId,
      },
      params: {
        per_page: 20,
        page,
        type_id: filterByEvent ? +filterByEvent : undefined,
        search_text: searchFor
          ? `${debouncedSearchFor}` || undefined
          : undefined,
        date_to: DateFormatter.trimDate(filterEndDate!),
        date_from: DateFormatter.trimDate(filterStartDate!),
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  const transactionPagination = usePagination({
    page,
    setPage,
    queryPage: transactionsQuery.data?.current_page,
    lastPage: transactionsQuery.data?.last_page,
    query: transactionsQuery,
  });

  const onScroll = useOnScrollPagination();

  const onRefresh = async () => {
    transactionPagination.refresh();

    dispatch(
      Query.util.invalidateTags([TagsApiBusinessAccounts.ACCOUNT_BALANCE]),
    );
  };

  useErrorHandler(() => {}, transactionsQuery);

  return (
    <Layout
      /**
       *Options
       */
      filterByEvent={filterByEvent}
      filterEndDate={filterEndDate}
      filterStartDate={filterStartDate}
      isLoading={transactionPagination.loading}
      isRefreshing={transactionPagination.refreshing}
      searchFor={searchFor}
      transactions={transactionsQuery.data?.data}
      transactionSum={transactionsQuery.data?.sum}
      /**
       *Methods
       */
      onFetchMore={onScroll(transactionPagination.fetchMore)}
      onRefresh={onRefresh}
      setFilterByEvent={transactionPagination.resetDecorator(setFilterByEvent)}
      setFilterEndDate={transactionPagination.resetDecorator(setFilterEndDate)}
      setFilterStartDate={transactionPagination.resetDecorator(
        setFilterStartDate,
      )}
      setSearchFor={transactionPagination.resetDecorator(setSearchFor)}
      {...props}
    />
  );
};

type PassingStates = {
  searchFor: string;
  filterByEvent?: EventIdTypes;
  filterStartDate?: Date;
  filterEndDate?: Date;
};

type PassingProps = {
  isLoading: boolean;
  isRefreshing: boolean;
  transactions?: DTOTransaction[];
  transactionSum?: number;
  onRefresh: () => void;
  onFetchMore: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
