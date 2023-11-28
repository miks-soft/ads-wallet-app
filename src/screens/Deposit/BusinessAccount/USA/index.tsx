import React, { useRef, RefObject } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { useSelector } from '#hooks/redux';

import { DepositRoutes, DepositScreenProps } from '#navigation/Deposit/types';

import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';
import { usePostCashlessPaymentMutation } from '#api/controllers/Tracker';

import ToastService from '#services/ToastService';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { isHaveErrors } from '#utils';

import { DTOBusinessAccount } from '#generated/types';

import Layout from './layout';

type NavigationProps = DepositScreenProps<DepositRoutes>;

const Container: React.FC<NavigationProps> = props => {
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

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

  const [postCashlessPayment, postCashlessPaymentMeta] =
    usePostCashlessPaymentMutation({});

  const [name, setName, errorName, setErrorName] = useField(
    currentBusinessAccount?.legal_name || '',
  );
  const [inn, setInn, errorInn, setErrorInn] = useField(
    currentBusinessAccount?.inn || '',
  );
  const [bank, setBank, errorBank, setErrorBank] = useField(
    currentBusinessAccount?.bank_name! || '',
  );
  const [bik, setBik, errorBik, setErrorBik] = useField(
    currentBusinessAccount?.bic! || '',
  );
  const [iban, setIban, errorIban, setErrorIban] = useField(
    currentBusinessAccount?.iban! || '',
  );
  const [swift, setSwift, errorSwift, setErrorSwift] = useField(
    currentBusinessAccount?.swift_code! || '',
  );
  const [bankAddress, setBankAddress, errorBankAddress, setErrorBankAddress] =
    useField(currentBusinessAccount?.bank_address! || '');

  const [amount, setAmount, errorAmount, setErrorAmount] = useField('');

  const refInn = useRef<TextInput>(null);
  const refBank = useRef<TextInput>(null);
  const refBik = useRef<TextInput>(null);
  const refIban = useRef<TextInput>(null);
  const refSwift = useRef<TextInput>(null);
  const refBankAddress = useRef<TextInput>(null);
  const refAmount = useRef<TextInput>(null);

  const validateAmount = (_amount = amount) => {
    const errors = +_amount < 30000;
    setErrorAmount(errors ? 'Summ cannot be less than 30 000 $' : '');
    return errors;
  };

  const validateName = (_name = name) => {
    const errors = _name === '';
    setErrorName(errors ? 'Name cannot be empty' : '');
    return errors;
  };

  const validateInn = (_inn = inn) => {
    const errors = _inn === '';
    setErrorInn(errors ? 'Tax number cannot be empty' : '');
    return errors;
  };

  const validateBank = (_bank = bank) => {
    const errors = _bank === '';
    setErrorBank(errors ? 'Bank name cannot be empty' : '');
    return errors;
  };

  const validateBik = (_bik = bik) => {
    const errors = _bik === '';
    setErrorBik(errors ? 'Routing number cannot be empty' : '');
    return errors;
  };

  const validateIban = (_iban = iban) => {
    const errors = _iban === '';
    setErrorIban(errors ? 'Account number cannot be empty' : '');
    return errors;
  };

  const validateSwift = (_swift = swift) => {
    const errors = _swift === '';
    setErrorSwift(errors ? 'Swift cannot be empty' : '');
    return errors;
  };

  const validateBankAddress = (_bankAddress = bankAddress) => {
    const errors = _bankAddress === '';
    setErrorBankAddress(errors ? 'Bank address cannot be empty' : '');
    return errors;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateAmount(),
        validateName(),
        validateInn(),
        validateBank(),
        validateBankAddress(),
        validateBik(),
        validateIban(),
        validateSwift(),
      ])
    ) {
      return;
    }

    try {
      await postCashlessPayment({
        data: {
          //@ts-expect-error
          bank_address: bankAddress,
          bank_name: bank,
          bic: bik,
          business_account_id: currentBusinessAccount?.id,
          gateway_code: 'cashless',
          iban: iban,
          inn: inn,
          legal_address: currentBusinessAccount?.legal_address,
          name_legal_entity: name,
          phone: currentBusinessAccount?.phone,
          swift_code: swift,
          sum: amount,
        },
      }).unwrap();

      props.navigation.goBack();

      ToastService.success('Request has been successfully send');
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorName(errors.name_legal_entity);
    setErrorInn(errors.inn);
    setErrorAmount(errors.sum);
  }, postCashlessPaymentMeta);

  return (
    <Layout
      /**
       *Options
       */
      amount={amount}
      bank={bank}
      bankAddress={bankAddress}
      bik={bik}
      currentBusinessAccount={currentBusinessAccount}
      errorAmount={errorAmount}
      errorBank={errorBank}
      errorBankAddress={errorBankAddress}
      errorBik={errorBik}
      errorIban={errorIban}
      errorInn={errorInn}
      errorName={errorName}
      errorSwift={errorSwift}
      iban={iban}
      inn={inn}
      isSubmitting={postCashlessPaymentMeta.isLoading}
      name={name}
      refAmount={refAmount}
      refBank={refBank}
      refBankAddress={refBankAddress}
      refBik={refBik}
      refIban={refIban}
      refInn={refInn}
      refSwift={refSwift}
      swift={swift}
      /**
       *Methods
       */
      onSubmit={onSubmit}
      setAmount={setAmount}
      setBank={setBank}
      setBankAddress={setBankAddress}
      setBik={setBik}
      setIban={setIban}
      setInn={setInn}
      setName={setName}
      setSwift={setSwift}
      validateAmount={validateAmount}
      validateBank={validateBank}
      validateBankAddress={validateBankAddress}
      validateBik={validateBik}
      validateIban={validateIban}
      validateInn={validateInn}
      validateName={validateName}
      validateSwift={validateSwift}
      {...props}
    />
  );
};

type PassingStates = {
  name: string;
  inn: string;
  amount: string;

  bank: string;
  bik: string;
  iban: string;
  swift: string;
  bankAddress: string;
};

type PassingProps = {
  errorAmount: string;
  errorInn: string;
  errorName: string;

  errorBank: string;
  errorBik: string;
  errorIban: string;
  errorSwift: string;
  errorBankAddress: string;

  refAmount: RefObject<TextInput>;
  refInn: RefObject<TextInput>;

  refBank: RefObject<TextInput>;
  refBik: RefObject<TextInput>;
  refIban: RefObject<TextInput>;
  refSwift: RefObject<TextInput>;
  refBankAddress: RefObject<TextInput>;

  currentBusinessAccount?: DTOBusinessAccount;

  isSubmitting: boolean;

  validateAmount: () => void;
  validateInn: () => void;
  validateName: () => void;
  validateBank: () => void;
  validateBik: () => void;
  validateIban: () => void;
  validateBankAddress: () => void;
  validateSwift: () => void;
  onSubmit: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
