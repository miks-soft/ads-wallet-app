import React, { useEffect, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useDispatch, useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  DrawerScreenProps,
  DrawerRoutes,
  MainScreenProps,
  MainRoutes,
} from '#navigation/Main/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { Query } from '#api';
import { useGetAdvertAccountsQuery } from '#api/controllers/AdvertServices';
import { TagsApiAdvertServices } from '#api/controllers/AdvertServices/types';
import { TagsApiBusinessAccounts } from '#api/controllers/BusinessAccounts/types';
import useAvailableAdvertServices from '#api/hooks/useAvailableAdvertServices';

import {
  AdvertisingAccountStatuses,
  ImplementedAdvertisingServices,
  SortDirections,
} from '#config/enums';

import useDebouncedState from '#hooks/useDebouncedState';
import useErrorHandler from '#hooks/useErrorHandler';
import { useOnScrollPagination } from '#hooks/useOnScrollPagination';
import usePagination from '#hooks/usePagination';

import { animateLayout } from '#utils';

import { DTOAdvertAccount } from '#generated/types';

import { SERVICE_CARD_WIDTH } from './components/ServiceCard/config';
import { AdvertisingFilteringOptionsValues } from './config';
import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  MainScreenProps<MainRoutes.Advertising>,
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

  const [currentService, setCurrentService] = useState<
    ImplementedAdvertisingServices | undefined
  >(undefined);
  const [page, setPage] = useState(1);

  const [searchFor, setSearchFor, debouncedSearchFor] = useDebouncedState('');
  const [filterByStatus, setFilterByStatus] = useState<
    AdvertisingAccountStatuses | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<
    AdvertisingFilteringOptionsValues | undefined
  >(undefined);
  const [sortDirection, setSortDirection] = useState(SortDirections.ASC);

  const advertAccountsQuery = useGetAdvertAccountsQuery(
    {
      params: {
        business_account_id: currentBusinessAccountId,
        service: currentService!,
        per_page: 10,
        page,
        search_text: searchFor ? debouncedSearchFor : undefined,
        status: filterByStatus,
        sort_col: sortBy,
        sort_dir: sortDirection,
      },
    },
    {
      skip: !currentService,
    },
  );

  const advertAccountPagination = usePagination({
    page,
    setPage,
    queryPage: advertAccountsQuery.data?.current_page,
    lastPage: advertAccountsQuery.data?.last_page,
    query: advertAccountsQuery,
  });

  const onScroll = useOnScrollPagination();

  const { availableServices } = useAvailableAdvertServices();

  const onRefresh = async () => {
    advertAccountPagination.refresh();

    dispatch(
      Query.util.invalidateTags([
        TagsApiAdvertServices.SERVICE_BALANCE,
        TagsApiBusinessAccounts.ACCOUNT_BALANCE,
      ]),
    );
  };

  const onServiceScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollIndex = Math.round(
      e.nativeEvent.contentOffset.x / SERVICE_CARD_WIDTH,
    );

    //TODO fix docs
    const newService = availableServices[currentScrollIndex];

    if (newService !== currentService) {
      animateLayout();

      setPage(1);
      setCurrentService(newService);
    }
  };

  useEffect(() => {
    //TODO FIX DOCS
    if (availableServices?.length) {
      setCurrentService(availableServices[0]);
    }
  }, [availableServices]);

  useErrorHandler(() => {}, advertAccountsQuery);

  return (
    <Layout
      /**
       *Options
       */
      accounts={advertAccountsQuery.data?.data}
      availableServices={availableServices}
      currentService={currentService}
      filterByStatus={filterByStatus}
      isLoading={advertAccountPagination.loading}
      isRefreshing={advertAccountPagination.refreshing}
      searchFor={searchFor}
      sortBy={sortBy}
      sortDirection={sortDirection}
      /**
       *Methods
       */
      onFetchMore={onScroll(advertAccountPagination.fetchMore)}
      onRefresh={onRefresh}
      onServiceScroll={onServiceScroll}
      setFilterByStatus={advertAccountPagination.resetDecorator(
        setFilterByStatus,
      )}
      setSearchFor={advertAccountPagination.resetDecorator(setSearchFor)}
      setSortBy={advertAccountPagination.resetDecorator(setSortBy)}
      setSortDirection={advertAccountPagination.resetDecorator(
        setSortDirection,
      )}
      {...props}
    />
  );
};

type PassingStates = {
  sortDirection: SortDirections;
  sortBy?: AdvertisingFilteringOptionsValues;
  filterByStatus?: AdvertisingAccountStatuses;
  searchFor: string;
};

type PassingProps = {
  availableServices: ImplementedAdvertisingServices[];
  isLoading: boolean;
  isRefreshing: boolean;
  accounts?: DTOAdvertAccount[];
  currentService?: ImplementedAdvertisingServices;
  onRefresh: () => void;
  onServiceScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onFetchMore: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
