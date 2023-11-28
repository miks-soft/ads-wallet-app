import { useEffect, useState } from 'react';

import { useSelector } from '#hooks/redux';

import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';

import { APP_CURRENCY_MAP } from '#config';
import { AllAdvertisingServices } from '#config/enums';

import {
  DTOAdvertAccount,
  DTOBusinessAccount,
  DTOCurrencyRate,
} from '#generated/types';

import { UIAdvertisingCampaignDeposit } from './types';

// TODO FIX DOCS TYPES
type _DTOBusinessAccount = DTOBusinessAccount & {
  tax_conditions: Record<AllAdvertisingServices, boolean>;
  commissions_conditions: Record<
    AllAdvertisingServices,
    | {
        max: string;
        min: string;
        percent: string;
      }[]
    | number
  >;
};

export type UIRatesInfo = {
  shouldExchangeCurrency: boolean;
  exchangeRate?: DTOCurrencyRate;
  shownExchangeRate?: DTOCurrencyRate;
};

const replaceNaN = (value: number) => (Number.isNaN(value) ? 0 : value);

const useCalculations = ({
  campaignsAmounts,
  accountAmount,
  isAllCampaignsForceSelected,
  advertAccount,
}: {
  campaignsAmounts?: UIAdvertisingCampaignDeposit[];
  isAllCampaignsForceSelected: boolean;
  accountAmount: string;
  advertAccount?: DTOAdvertAccount;
}) => {
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [finalAmount, setFinalAmount] = useState(0);
  const [finalAmountWithCommission, setFinalAmountWithCommission] = useState(0);
  const [totalNds, setTotalNds] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [currentCommission, setCurrentCommission] = useState(0);

  const [withCommision, setWithCommision] = useState(true);
  const [withNds, setWithNds] = useState(true);

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

  const calculateFinalAmount = (
    _accountAmount = accountAmount,
    _campaignsAmounts = campaignsAmounts,
    _isAllCampaignsForceSelected = isAllCampaignsForceSelected,
  ) => {
    let amount = +_accountAmount;

    _campaignsAmounts?.forEach(el => {
      amount += _isAllCampaignsForceSelected || el.selected ? +el.amount : 0;
    });

    return amount;
  };

  const calculateCurrentCommision = () => {
    if (!withCommision) {
      return 0;
    }

    let percent = 0;

    // TODO FIX DOCS TYPES
    const _currentBusinessAccount =
      currentBusinessAccount as _DTOBusinessAccount;

    if (!_currentBusinessAccount || !advertAccount) {
      return percent;
    }

    const serviceCommisions =
      _currentBusinessAccount.commissions_conditions[advertAccount.service];

    if (
      serviceCommisions &&
      Array.isArray(serviceCommisions) &&
      serviceCommisions.length
    ) {
      const item = serviceCommisions.find(el => finalAmount <= +el.max);

      percent = item ? +item.percent : 0;
    } else {
      percent = +serviceCommisions;
    }

    return percent;
  };

  const calculateFinalAmountWithCommision = (
    _finalAmount = finalAmount,
    _currentCommission = currentCommission,
  ) => {
    return _currentCommission
      ? (_finalAmount * (100 - _currentCommission)) / 100
      : _finalAmount;
  };

  const calculateTotalNds = (
    _finalAmountWithCommission = finalAmountWithCommission,
  ) => {
    if (!withNds) {
      return 0;
    }
    return Math.ceil(_finalAmountWithCommission / 6);
  };

  const calculateTotalSum = (
    _finalAmountWithCommission = finalAmountWithCommission,
    _totalNds = totalNds,
  ) => {
    return _finalAmountWithCommission - _totalNds;
  };

  useEffect(() => {
    if (!currentBusinessAccount || !advertAccount) {
      return;
    }

    const _currentBusinessAccount =
      currentBusinessAccount as _DTOBusinessAccount;

    setWithNds(_currentBusinessAccount.tax_conditions[advertAccount?.service]);
    setWithCommision(
      !!_currentBusinessAccount.commissions_conditions[advertAccount?.service],
    );
  }, [advertAccount, currentBusinessAccount]);

  useEffect(() => {
    const _finalAmount = calculateFinalAmount();
    const _curentCommision = calculateCurrentCommision();
    const _finalAmountWithCommision = calculateFinalAmountWithCommision(
      _finalAmount,
      _curentCommision,
    );
    const _totalNds = calculateTotalNds(_finalAmountWithCommision);
    const _totalSum = calculateTotalSum(_finalAmountWithCommision, _totalNds);

    setFinalAmount(replaceNaN(_finalAmount));
    setCurrentCommission(replaceNaN(_curentCommision));
    setFinalAmountWithCommission(replaceNaN(_finalAmountWithCommision));
    setTotalNds(replaceNaN(_totalNds));
    setTotalSum(Math.floor(replaceNaN(_totalSum)));
  }, [
    accountAmount,
    campaignsAmounts?.reduce(
      (acc, el) =>
        acc + (el.selected || isAllCampaignsForceSelected ? +el.amount : 0),
      0,
    ),
  ]);

  return {
    finalAmount,
    withNds,
    withCommision,
    finalAmountWithCommission,
    totalNds,
    totalSum,
    currentCommission,
  };
};

const useRates = ({
  businessAccount,
  serviceAccount,
  exchangeRates,
}: {
  businessAccount?: DTOBusinessAccount;
  serviceAccount?: DTOAdvertAccount;
  exchangeRates?: DTOCurrencyRate[];
}) => {
  const [ratesInfo, setRatesInfo] = useState<UIRatesInfo | undefined>();
  const region = useSelector(store => store.app.region);

  const adjustRate = (exchangeRate: DTOCurrencyRate, percent: number) => {
    return {
      ...exchangeRate,
      value: (exchangeRate?.value! * (100 + percent)) / 100,
    };
  };

  const getRates = () => {
    const shouldExchangeCurrency =
      APP_CURRENCY_MAP[region] !== serviceAccount?.service_currency;

    let exchangeRate = exchangeRates?.find(
      el =>
        el.from === APP_CURRENCY_MAP[region] &&
        el.to === serviceAccount?.service_currency,
    );

    let invertedExchangeRate = exchangeRates?.find(
      el =>
        el.to === APP_CURRENCY_MAP[region] &&
        el.from === serviceAccount?.service_currency,
    );

    if (!(exchangeRate && invertedExchangeRate)) {
      return { shouldExchangeCurrency: false };
    }

    let exchangeRateAdjusted = adjustRate(
      exchangeRate,
      -(businessAccount?.course_percent || '0'),
    );

    let invertedExchangeRateAdjusted = adjustRate(
      invertedExchangeRate,
      +(businessAccount?.course_percent || '0'),
    );

    const shownExchangeRate =
      exchangeRate?.value && exchangeRate?.value > 1
        ? exchangeRateAdjusted
        : invertedExchangeRateAdjusted;

    return {
      shouldExchangeCurrency,
      exchangeRate: exchangeRateAdjusted,
      shownExchangeRate,
    };
  };
  useEffect(() => {
    setRatesInfo(getRates());
  }, [businessAccount, serviceAccount, exchangeRates, region]);

  return ratesInfo;
};
export { useCalculations, useRates };
