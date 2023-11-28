import React, { RefObject, useRef } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { useSelector } from '#hooks/redux';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { STRINGS } from '#localization';

import { useAddAdvertAccountMutation } from '#api/controllers/AdvertServices';

import ToastService from '#services/ToastService';

import { AllAdvertisingServices } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';
import useModal, { ModalController } from '#hooks/useModal';

import { isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.CreateVkAccount>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [link, setLink, errorLink, setErrorLink] = useField('');
  const [name, setName, errorName, setErrorName] = useField('');

  const refName = useRef<TextInput>(null);

  const [addAccount, addAccountMeta] = useAddAdvertAccountMutation({});

  const onAdd = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateLink()])) {
      return;
    }

    try {
      await addAccount({
        data: {
          service: AllAdvertisingServices.VK,
          business_account_id: currentBusinessAccountId,
          is_exist: true,
          account_name: link,
          user_name: name ? name : undefined,
        },
      }).unwrap();

      ToastService.success(STRINGS.TOASTS.createAdvertismentAccountSuccess);

      props.route.params.onEnd && props.route.params.onEnd();

      modal.close();
    } catch {}
  };

  const validateLink = (_link = link) => {
    const errors = !link.trim().startsWith('http');
    setErrorLink(
      errors ? STRINGS.MODAL_CREATE_VK_ACCOUNT.linkVerificationError : '',
    );
    return errors;
  };

  useErrorHandler(errors => {
    setErrorLink(errors.account_name);
    setErrorName(errors.user_name);
  }, addAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      errorLink={errorLink}
      errorName={errorName}
      isLoading={addAccountMeta.isLoading}
      link={link}
      modal={modal}
      name={name}
      refName={refName}
      /**
       *Methods
       */
      onAdd={onAdd}
      setLink={setLink}
      setName={setName}
      validateLink={validateLink}
      {...props}
    />
  );
};

type PassingStates = {
  link: string;
  name: string;
};

type PassingProps = {
  refName: RefObject<TextInput>;
  errorLink: string;
  errorName: string;
  modal: ModalController;
  isLoading: boolean;

  onAdd: () => void;
  validateLink: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
