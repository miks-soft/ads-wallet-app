import React, { useRef, RefObject, useState } from 'react';
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
  const [kpp, setKpp, errorKpp, setErrorKpp] = useField(
    currentBusinessAccount?.kpp || '',
  );
  const [address, setAddress, errorAddress, setErrorAddress] = useField(
    currentBusinessAccount?.legal_address || '',
  );
  const [phone, setPhone, errorPhone, setErrorPhone] = useField(
    currentBusinessAccount?.phone
      ?.slice(2)
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('-', '')! || '',
  );
  const [amount, setAmount, errorAmount, setErrorAmount] = useField('');

  const [phoneUnmasked, setPhoneUnmasked] = useState('');

  const refInn = useRef<TextInput>(null);
  const refKpp = useRef<TextInput>(null);
  const refAddress = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refAmount = useRef<TextInput>(null);

  const validatePhone = (_phone = phoneUnmasked) => {
    const errors = _phone.length !== 10;
    setErrorPhone(
      errors ? 'Проверьте правильность введенного номера телефона' : '',
    );
    return errors;
  };

  const validateAmount = (_amount = amount) => {
    const errors = +_amount < 30000;
    setErrorAmount(errors ? 'Минимальная сумма зачисления 30 000 ₽' : '');
    return errors;
  };

  const validateName = (_name = name) => {
    const errors = _name === '';
    setErrorName(errors ? 'Укажите наименование' : '');
    return errors;
  };

  const validateInn = (_inn = inn) => {
    const errors = _inn === '';
    setErrorInn(errors ? 'Укажите ИНН' : '');
    return errors;
  };

  const validateAddress = (_address = address) => {
    const errors = _address === '';
    setErrorAddress(errors ? 'Укажите адрес' : '');
    return errors;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validatePhone(),
        validateAmount(),
        validateName(),
        validateInn(),
        validateAddress(),
      ])
    ) {
      return;
    }

    try {
      await postCashlessPayment({
        data: {
          business_account_id: currentBusinessAccount?.id,
          name_legal_entity: name,
          inn,
          kpp: kpp ? kpp : undefined,
          legal_address: address,
          phone: `+7${phoneUnmasked}`,
          sum: amount,
          gateway_code: 'cashless',
        },
      }).unwrap();

      props.navigation.goBack();

      ToastService.success('Запрос был успешно отправлен');
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorName(errors.name_legal_entity);
    setErrorInn(errors.inn);
    setErrorKpp(errors.kpp);
    setErrorAddress(errors.legal_address);
    setErrorPhone(errors.phone);
    setErrorAmount(errors.sum);
  }, postCashlessPaymentMeta);

  return (
    <Layout
      /**
       *Options
       */
      address={address}
      amount={amount}
      currentBusinessAccount={currentBusinessAccount}
      errorAddress={errorAddress}
      errorAmount={errorAmount}
      errorInn={errorInn}
      errorKpp={errorKpp}
      errorName={errorName}
      errorPhone={errorPhone}
      inn={inn}
      isSubmitting={postCashlessPaymentMeta.isLoading}
      kpp={kpp}
      name={name}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      refAddress={refAddress}
      refAmount={refAmount}
      refInn={refInn}
      refKpp={refKpp}
      refPhone={refPhone}
      /**
       *Methods
       */
      onSubmit={onSubmit}
      setAddress={setAddress}
      setAmount={setAmount}
      setInn={setInn}
      setKpp={setKpp}
      setName={setName}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
      validateAddress={validateAddress}
      validateAmount={validateAmount}
      validateInn={validateInn}
      validateName={validateName}
      validatePhone={validatePhone}
      {...props}
    />
  );
};

type PassingStates = {
  address: string;
  phoneUnmasked: string;
  amount: string;
  inn: string;
  name: string;
  phone: string;
  kpp: string;
};

type PassingProps = {
  errorAddress: string;
  errorAmount: string;
  errorInn: string;
  errorName: string;
  errorPhone: string;
  errorKpp: string;

  refAddress: RefObject<TextInput>;
  refAmount: RefObject<TextInput>;
  refInn: RefObject<TextInput>;
  refPhone: RefObject<TextInput>;
  refKpp: RefObject<TextInput>;

  currentBusinessAccount?: DTOBusinessAccount;

  isSubmitting: boolean;

  validatePhone: () => void;
  validateAmount: () => void;
  validateAddress: () => void;
  validateInn: () => void;
  validateName: () => void;
  onSubmit: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
