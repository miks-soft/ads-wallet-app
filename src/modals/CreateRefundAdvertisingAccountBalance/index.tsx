import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { STRINGS } from '#localization';

import { useRefundMutation } from '#api/controllers/AdvertServices';

import NumberFormatter from '#services/formatters/Number';
import ToastService from '#services/ToastService';

import useField from '#hooks/useField';
import useModal, { ModalController } from '#hooks/useModal';

import { isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps =
  ModalsScreenProps<ModalsRoutes.CreateRefundAdvertisingAccountBalance>;

const Container: React.FC<NavigationProps> = props => {
  const { account } = props.route.params;

  const modal = useModal(true);

  const [amount, setAmount, errorAmount, setErrorAmount] = useField('');
  const [shouldTransferAll, setShouldTransferAll] = useState(false);

  const [refund, refundMeta] = useRefundMutation({});

  const validateAmount = (_amount = amount) => {
    const errors = +_amount < 1;
    setErrorAmount(
      errors
        ? STRINGS.MODAL_REFUND_ADVERTISING_ACCOUNT_BALANCE
            .amountVerficationError
        : '',
    );
    return errors;
  };

  const onRefund = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateAmount()])) {
      return;
    }

    try {
      await refund({
        data: {
          service: account.service,
          amount: shouldTransferAll ? '' : amount,
          account_id: account.id,
        },
      }).unwrap();

      ToastService.success(
        STRINGS.MODAL_REFUND_ADVERTISING_ACCOUNT_BALANCE.toastSuccess,
      );

      modal.close();
    } catch {}
  };

  useEffect(() => {
    if (refundMeta.error && 'data' in refundMeta?.error) {
      setErrorAmount(refundMeta.error.data.errors as unknown as string);
    }
  }, [refundMeta.error]);

  return (
    <Layout
      /**
       *Options
       */
      amount={amount}
      errorAmount={errorAmount}
      isLoading={refundMeta.isLoading}
      maxAmount={NumberFormatter.format(account.balance)}
      modal={modal}
      shouldTransferAll={shouldTransferAll}
      /**
       *Methods
       */
      onRefund={onRefund}
      setAmount={setAmount}
      setShouldTransferAll={setShouldTransferAll}
      validateAmount={validateAmount}
      {...props}
    />
  );
};

type PassingStates = {
  shouldTransferAll: boolean;
  amount: string;
};

type PassingProps = {
  maxAmount: string;
  errorAmount: string;
  isLoading: boolean;

  modal: ModalController;
  onRefund: () => void;

  validateAmount: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
