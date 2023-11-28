import React, { RefObject, useRef } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useAddAdvertAccountMutation } from '#api/controllers/AdvertServices';

import ToastService from '#services/ToastService';

import { AllAdvertisingServices } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';
import useModal, { ModalController } from '#hooks/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.CreateVkAdsAccount>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [accountId, setAccountId, errorAccountId, setErrorAccountId] =
    useField('');
  const [name, setName, errorName, setErrorName] = useField('');

  const refName = useRef<TextInput>(null);

  const [addAccount, addAccountMeta] = useAddAdvertAccountMutation({});

  const onAdd = async () => {
    Keyboard.dismiss();

    try {
      await addAccount({
        data: {
          service: AllAdvertisingServices.VK,
          business_account_id: currentBusinessAccountId,
          is_exist: true,
          account_name: accountId,
          user_name: name ? name : undefined,
        },
      }).unwrap();

      ToastService.success(STRINGS.TOASTS.createAdvertismentAccountSuccess);

      props.route.params.onEnd && props.route.params.onEnd();

      modal.close();
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorAccountId(errors.account_name);
    setErrorName(errors.user_name);
  }, addAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      accountId={accountId}
      errorAccountId={errorAccountId}
      errorName={errorName}
      isLoading={addAccountMeta.isLoading}
      modal={modal}
      name={name}
      refName={refName}
      /**
       *Methods
       */
      onAdd={onAdd}
      setAccountId={setAccountId}
      setName={setName}
      {...props}
    />
  );
};

type PassingStates = {
  accountId: string;
  name: string;
};

type PassingProps = {
  refName: RefObject<TextInput>;
  errorAccountId: string;
  errorName: string;
  modal: ModalController;
  isLoading: boolean;

  onAdd: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
