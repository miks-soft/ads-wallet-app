import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import { DepositRoutes, DepositScreenProps } from '#navigation/Deposit/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import {
  useChangeAccountBalanceMutation,
  useGetAccountCampaignsQuery,
} from '#api/controllers/AdvertServices';
import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';
import { useGetExchangeRatesQuery } from '#api/controllers/Currency';

import ToastService from '#services/ToastService';

import { ImplementedAdvertisingServices } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { isHaveErrors } from '#utils';

import {
  DTOAdvertAccount,
  DTOAdvertAccountCampaign,
  DTOBusinessAccount,
  DTOCurrencyRate,
} from '#generated/types';

import Layout from './layout';
import {
  DEFAULT_DEPOSIT_AMOUNT,
  DepositAdvertisingAccountSources,
  UIAdvertisingCampaignDeposit,
} from './types';
import { UIRatesInfo, useCalculations, useRates } from './utils';

type NavigationProps = CompositeScreenProps<
  DepositScreenProps<DepositRoutes>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const [selectedPaymentSource, setSelectedPaymentSource] = useState(
    DepositAdvertisingAccountSources.WALLET,
  );
  const [selectedAccount, setSelectedAccount] = useState<
    DTOAdvertAccount | undefined
  >(props.route.params?.defaultAccount);

  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [amount, setAmount, errorAmount, setErrorAmount] = useField('');

  const { data: currentBusinessAccount } = useGetBusinessAccountQuery(
    {
      path: {
        business_account: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  const campaignsQuery = useGetAccountCampaignsQuery(
    {
      params: {
        account_id: selectedAccount?.id!,
      },
    },
    {
      skip: !selectedAccount?.id,
    },
  );

  const exchangeRatesQuery = useGetExchangeRatesQuery(undefined, {
    skip: selectedAccount?.service !== ImplementedAdvertisingServices.Google,
  });

  const [campaignsAmounts, setCampaignsAmounts] = useState<
    UIAdvertisingCampaignDeposit[] | undefined
  >(
    campaignsQuery.data?.map(el => ({
      campaign_id: el.id,
      amount: DEFAULT_DEPOSIT_AMOUNT,
      selected: false,
    })),
  );

  const [changeAccountsBalance, changeAccountsBalanceMeta] =
    useChangeAccountBalanceMutation();

  const [isAllCampaignsForceSelected, setIsAllCampaignsForceSelected] =
    useState(false);

  const calculations = useCalculations({
    campaignsAmounts,
    accountAmount: amount,
    isAllCampaignsForceSelected,
    advertAccount: selectedAccount,
  });

  const ratesInfo = useRates({
    businessAccount: currentBusinessAccount,
    serviceAccount: selectedAccount,
    exchangeRates: exchangeRatesQuery.data,
  });

  const validateAmount = (_amount = amount) => {
    const errors = amount && +amount < 100;
    setErrorAmount(errors ? 'Минимальная сумма 100 ₽' : '');
    return !!errors;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateAmount()])) {
      return;
    }

    try {
      const result = (await changeAccountsBalance({
        data: {
          service: selectedAccount?.service!,
          account_id: selectedAccount?.id!,
          business_account_id: currentBusinessAccountId,
          total_sum: calculations.finalAmount,
          //@ts-ignore
          campaigns_amounts:
            campaignsAmounts!
              .map(el =>
                el.selected || isAllCampaignsForceSelected
                  ? { campaign_id: el.campaign_id, amount: el.amount }
                  : undefined,
              )
              .filter(el => el) || [],
          from_cashback:
            selectedPaymentSource === DepositAdvertisingAccountSources.CASHBACK,
        },
      }).unwrap()) as { total: string };
      props.navigation.goBack();

      ToastService.success(
        `Рекламные компании были пополнены на общую сумму ${result.total}`,
      );
    } catch {}
  };

  useEffect(() => {
    const newCampaignsAmounts: UIAdvertisingCampaignDeposit[] = [];

    campaignsQuery.data?.forEach(campaignBE => {
      const staleCampaignAmount = campaignsAmounts?.find(
        campaignFE => campaignFE?.campaign_id === campaignBE.id,
      );

      if (staleCampaignAmount) {
        newCampaignsAmounts.push(staleCampaignAmount);
      } else {
        newCampaignsAmounts.push({
          campaign_id: campaignBE.id,
          amount: DEFAULT_DEPOSIT_AMOUNT,
          selected: false,
        });
      }
    });

    setCampaignsAmounts(newCampaignsAmounts);
  }, [campaignsQuery.data]);

  useErrorHandler(errors => {
    setErrorAmount(errors.total_sum);

    Object.entries(errors).forEach(([key, error]) => {
      const [path, index] = key.split('.');

      if (path === 'campaigns_amounts') {
        const selectedCampaigns = campaignsAmounts?.filter(
          el => el.selected || isAllCampaignsForceSelected,
        );

        const errorCampaignId = selectedCampaigns?.[+index]?.campaign_id;

        setCampaignsAmounts(old =>
          old?.map(el =>
            el.campaign_id === errorCampaignId ? { ...el, error } : el,
          ),
        );
      }
    });
  }, changeAccountsBalanceMeta);

  return (
    <Layout
      /**
       *Options
       */
      amount={amount}
      calculations={calculations}
      campaignAmounts={campaignsAmounts}
      campaigns={campaignsQuery.data}
      currentBusinessAccount={currentBusinessAccount}
      errorAmount={errorAmount}
      exchangeRates={exchangeRatesQuery.data}
      isAllCampaignsForceSelected={isAllCampaignsForceSelected}
      isSubmitting={changeAccountsBalanceMeta.isLoading}
      ratesInfo={ratesInfo}
      selectedAccount={selectedAccount}
      selectedPaymentSource={selectedPaymentSource}
      /**
       *Methods
       */
      onSubmit={onSubmit}
      setAmount={setAmount}
      setCampaignAmounts={setCampaignsAmounts}
      setIsAllCampaignsForceSelected={setIsAllCampaignsForceSelected}
      setSelectedAccount={setSelectedAccount}
      setSelectedPaymentSource={setSelectedPaymentSource}
      {...props}
    />
  );
};

type PassingStates = {
  isAllCampaignsForceSelected: boolean;
  campaignAmounts?: UIAdvertisingCampaignDeposit[];
  selectedPaymentSource: DepositAdvertisingAccountSources;

  selectedAccount?: DTOAdvertAccount;
  amount: string;
};

type PassingProps = {
  campaigns?: DTOAdvertAccountCampaign[];
  exchangeRates?: DTOCurrencyRate[];
  currentBusinessAccount?: DTOBusinessAccount;
  calculations: ReturnType<typeof useCalculations>;
  isSubmitting: boolean;
  ratesInfo?: UIRatesInfo;

  errorAmount: string;
  onSubmit: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
