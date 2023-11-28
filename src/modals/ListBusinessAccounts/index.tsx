import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useDispatch } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetBusinessAccountsQuery } from '#api/controllers/BusinessAccounts';

import useErrorHandler from '#hooks/useErrorHandler';
import useModal, { ModalController } from '#hooks/useModal';
import { useOnScrollPagination } from '#hooks/useOnScrollPagination';
import usePagination from '#hooks/usePagination';

import { AppActions } from '#store/slices/app';

import { DTOBusinessAccount } from '#generated/types';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.ListBusinessAccounts>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  //@ts-expect-error TODO FIX DOCS
  const businessAccountsQuery = useGetBusinessAccountsQuery({
    params: {
      per_page: 20,
      page: page,
    },
  });

  const onScroll = useOnScrollPagination();

  const businessAccountsPagination = usePagination({
    page,
    setPage,
    queryPage: businessAccountsQuery.data?.current_page,
    lastPage: businessAccountsQuery.data?.last_page,
    query: businessAccountsQuery,
  });

  const [selectedAccount, setSelectedAccount] = useState<
    DTOBusinessAccount | undefined
  >(undefined);

  const onChangeAccount = () => {
    modal.close();

    dispatch(AppActions.setCurrentBusinessAccountId(selectedAccount!.id!));
  };

  useErrorHandler(() => {}, businessAccountsQuery);
  return (
    <Layout
      /**
       *Options
       */
      businessAccounts={businessAccountsQuery.data?.data}
      isLoading={businessAccountsPagination.loading}
      isRefreshing={businessAccountsPagination.refreshing}
      modal={modal}
      selectedAccount={selectedAccount}
      /**
       *Methods
       */
      onChangeAccount={onChangeAccount}
      onRefresh={businessAccountsPagination.refresh}
      onScroll={onScroll(businessAccountsPagination.fetchMore)}
      setSelectedAccount={setSelectedAccount}
      {...props}
    />
  );
};

type PassingStates = {
  selectedAccount?: DTOBusinessAccount;
};

type PassingProps = {
  isRefreshing: boolean;
  isLoading: boolean;
  modal: ModalController;
  businessAccounts?: DTOBusinessAccount[];
  onChangeAccount: () => void;

  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onRefresh: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
