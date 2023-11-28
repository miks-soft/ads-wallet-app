import React, { useState } from 'react';

import { useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import _ from 'lodash';

import {
  ObserversRoutes,
  ObserversScreenProps,
} from '#navigation/Observers/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useGetServiceAccountsQuery } from '#api/controllers/AdvertServices';
import {
  useAttachObserverClientMutation,
  useDeleteObserverMutation,
  useDetachObserverClientMutation,
  usePostObserverMutation,
} from '#api/controllers/AdvertServicesObservers';

import ToastService from '#services/ToastService';

import { ImplementedAdvertisingServices } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';
import { Transformations, useTransformer } from '#hooks/useTransformer';

import { animateDecorator } from '#utils';

import { DTOObserver, DTOObserverClient } from '#generated/types';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ObserversScreenProps<ObserversRoutes.VK_CRUD>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const { observer } = props.route.params;

  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const serviceAccountsQuery = useGetServiceAccountsQuery(
    {
      params: {
        service: ImplementedAdvertisingServices.VK,
        business_account_id: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  const observerClients = useTransformer(
    Transformations.AdvertAccount.to.ObserverClient,
    serviceAccountsQuery.data,
  );

  const [postObserver, postObserverMeta] = usePostObserverMutation({});
  const [attachObserverClient, attachObserverClientMeta] =
    useAttachObserverClientMutation({});
  const [detachObserverClient, detachObserverClientMeta] =
    useDetachObserverClientMutation({});
  const [deleteObserver, deleteObserverMeta] = useDeleteObserverMutation({});

  const [accountLink, setAccountLink, errorAccountLink, setErrorAccountLink] =
    useField(observer ? `${observer.first_name} ${observer.last_name}` : '');

  const [selectedObserverClients, setSelectedObserverClients] = useState<
    DTOObserverClient[] | undefined
  >(observer?.clients || []);

  const onCreate = async () => {
    try {
      await postObserver({
        data: {
          service: ImplementedAdvertisingServices.VK,
          user_name: accountLink,
          accounts: selectedObserverClients?.map(el => el.account_id)!,
        },
      }).unwrap();

      ToastService.success(STRINGS.SCREEN_OBSERVERS_VK_CRUD.toastCreateSuccess);

      props.navigation.goBack();
    } catch {}
  };

  const onDelete = async () => {
    try {
      await deleteObserver({
        data: {
          service: ImplementedAdvertisingServices.VK,
          observer_id: observer?.id!,
          business_account_id: currentBusinessAccountId,
        },
      }).unwrap();

      ToastService.success(STRINGS.SCREEN_OBSERVERS_VK_CRUD.toastDeleteSuccess);

      props.navigation.goBack();
    } catch {}
  };

  const onEdit = async () => {
    try {
      const detachedClients = _.differenceWith(
        observer?.clients,
        selectedObserverClients!,
        (a, b) => a.id === b.id,
      );

      if (detachedClients.length) {
        await detachObserverClient({
          data: {
            business_account_id: currentBusinessAccountId,
            service: ImplementedAdvertisingServices.VK,
            observer_id: observer?.id!,
            //@ts-expect-error TODO fix docs,
            account_id: detachedClients?.map(el => el.account_id),
          },
        }).unwrap();
      }

      await attachObserverClient({
        data: {
          business_account_id: currentBusinessAccountId,
          service: ImplementedAdvertisingServices.VK,
          observer_id: observer?.id!,
          //@ts-expect-error TODO fix docs,
          account_id: selectedObserverClients?.map(el => el.account_id),
        },
      }).unwrap();

      ToastService.success(STRINGS.SCREEN_OBSERVERS_VK_CRUD.toastEditSuccess);

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorAccountLink(errors.user_name);
  }, postObserverMeta);

  return (
    <Layout
      /**
       *Options
       */
      accountLink={accountLink}
      accountsLoading={serviceAccountsQuery.isLoading}
      errorAccountLink={errorAccountLink}
      isSubmitting={
        postObserverMeta.isLoading ||
        attachObserverClientMeta.isLoading ||
        detachObserverClientMeta.isLoading ||
        deleteObserverMeta.isLoading
      }
      observer={observer}
      observerClients={observerClients}
      selectedObserverClients={selectedObserverClients}
      /**
       *Methods
       */
      onCreate={onCreate}
      onDelete={onDelete}
      onEdit={onEdit}
      setAccountLink={setAccountLink}
      setSelectedObserverClients={animateDecorator(setSelectedObserverClients)}
      {...props}
    />
  );
};

type PassingStates = {
  selectedObserverClients?: DTOObserverClient[];
  accountLink: string;
};

type PassingProps = {
  observer?: DTOObserver;
  isSubmitting: boolean;
  errorAccountLink: string;
  accountsLoading: boolean;
  observerClients?: DTOObserverClient[];
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
