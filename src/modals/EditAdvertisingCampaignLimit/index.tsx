import React from 'react';
import { Keyboard } from 'react-native';

import { useSelector } from '#hooks/redux';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { STRINGS } from '#localization';

import { useChangeCampaignBudgetMutation } from '#api/controllers/AdvertServices';

import ToastService from '#services/ToastService';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';
import useModal, { ModalController } from '#hooks/useModal';

import { DTOAdvertAccountCampaign } from '#generated/types';

import Layout from './layout';

type NavigationProps =
  ModalsScreenProps<ModalsRoutes.EditAdvertisingCampaignLimit>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal();
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );
  const [amount, setAmount, errorAmount, setErrorAmount] = useField('');

  const [changeLimit, changeLimitMeta] = useChangeCampaignBudgetMutation();

  const onChangeLimit = async () => {
    Keyboard.dismiss();

    try {
      await changeLimit({
        data: {
          business_account_id: currentBusinessAccountId,
          campaign_id: props.route.params.account.id,
          account_id: props.route.params.advertisingAccountId,
          budget_limit: amount,
        },
      }).unwrap();

      ToastService.success(
        STRINGS.MODAL_EDIT_ADVERTISING_CAMPAIGN_LIMIT.toastSuccess,
      );

      modal.close();
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorAmount(errors.budget_limit);
  }, changeLimitMeta);

  return (
    <Layout
      /**
       *Options
       */
      account={props.route.params.account}
      amount={amount}
      errorAmount={errorAmount}
      isLoading={changeLimitMeta.isLoading}
      modal={modal}
      /**
       *Methods
       */
      onChangeLimit={onChangeLimit}
      setAmount={setAmount}
      {...props}
    />
  );
};

type PassingStates = {
  amount: string;
};

type PassingProps = {
  errorAmount: string;
  isLoading: boolean;
  account: DTOAdvertAccountCampaign;

  modal: ModalController;
  onChangeLimit: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
