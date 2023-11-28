import React from 'react';
import { Keyboard } from 'react-native';

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

type NavigationProps = ModalsScreenProps<ModalsRoutes.CreateYandexAccount>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [name, setName, errorName, setErrorName] = useField('');

  const [addAccount, addAccountMeta] = useAddAdvertAccountMutation({});

  const onAdd = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateName()])) {
      return;
    }

    try {
      await addAccount({
        data: {
          service: AllAdvertisingServices.Yandex,
          business_account_id: currentBusinessAccountId,
          is_exist: true,
          account_name: name,
        },
      }).unwrap();

      ToastService.success(STRINGS.TOASTS.createAdvertismentAccountSuccess);

      props.route.params.onEnd && props.route.params.onEnd();

      modal.close();
    } catch {}
  };

  const validateName = (_name = name) => {
    const errors = !/[A-z0-9\-.]/.test(name) || !/^[A-z]/.test(name);
    setErrorName(
      errors ? STRINGS.MODAL_CREATE_YANDEX_ACCOUNT.nameVerificationError : '',
    );
    return errors;
  };

  useErrorHandler(errors => {
    setErrorName(errors.account_name);
  }, addAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      errorName={errorName}
      isLoading={addAccountMeta.isLoading}
      modal={modal}
      name={name}
      /**
       *Methods
       */
      onAdd={onAdd}
      setName={setName}
      validateName={validateName}
      {...props}
    />
  );
};

type PassingStates = {
  name: string;
};

type PassingProps = {
  errorName: string;
  modal: ModalController;
  isLoading: boolean;

  onAdd: () => void;
  validateName: () => void;
};
export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
