/* eslint-disable max-lines */
import React, { useRef, useState, RefObject } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { useDispatch, useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  BusinessAccountRoutes,
  BusinessAccountScreenProps,
} from '#navigation/BusinessAccount/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import {
  useCheckInnMutation,
  usePatchBusinessAccountMutation,
  usePostBusinessAccountMutation,
} from '#api/controllers/BusinessAccounts';

import ToastService from '#services/ToastService';
import EmailValidator from '#services/validators/EmailValidator';

import { DocumentsDeliveryTypes } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { animateDecorator, animateLayout, isHaveErrors } from '#utils';

import { AppActions } from '#store/slices/app';

import { CONST_PAYLOAD } from './config';
import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  BusinessAccountScreenProps<BusinessAccountRoutes.CU>,
  AppScreenProps<AppRoutes>
> & { tab: number; setTab: SetState<number> };

const Container: React.FC<NavigationProps> = props => {
  const dispatch = useDispatch();

  const { isEdit, businessAccount } = props.route.params;

  const isNoBussinesAccountStub = useSelector(
    store => store.app.stubs.noBusinessAccount,
  );

  const [inn, setInn, errorInn, setErrorInn] = useField(
    isEdit ? businessAccount?.inn! : '',
  );
  const [mailAddress, setMailAddress, errorMailAddress, setErrorMailAddress] =
    useField(isEdit ? businessAccount?.legal_receiving_physical_address! : '');
  const [name, setName, errorName, setErrorName] = useField(
    isEdit ? businessAccount?.legal_contact_name! : '',
  );
  const [email, setEmail, errorEmail, setErrorEmail] = useField(
    isEdit ? businessAccount?.email! : '',
  );
  const [phone, setPhone, errorPhone, setErrorPhone] = useField(
    isEdit ? businessAccount?.phone! : '',
  );
  const [bank, setBank, errorBank, setErrorBank] = useField(
    isEdit ? businessAccount?.bank_name! : '',
  );
  const [bik, setBik, errorBik, setErrorBik] = useField(
    isEdit ? businessAccount?.bic! : '',
  );
  const [iban, setIban, errorIban, setErrorIban] = useField(
    isEdit ? businessAccount?.iban! : '',
  );
  const [swift, setSwift, errorSwift, setErrorSwift] = useField(
    isEdit ? businessAccount?.swift_code! : '',
  );
  const [bankAddress, setBankAddress, errorBankAddress, setErrorBankAddress] =
    useField(isEdit ? businessAccount?.bank_address! : '');
  const [phoneUnmasked, setPhoneUnmasked] = useState(
    isEdit
      ? businessAccount?.phone
          ?.slice(2)
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')!
      : '',
  );
  const [documentsDeliveryMethod, setDocumentsDeliveryMethod] =
    useState<DocumentsDeliveryTypes>(
      isEdit
        ? (businessAccount?.legal_receiving_docs_method! as DocumentsDeliveryTypes)
        : DocumentsDeliveryTypes.COURIER,
    );

  const refMailAddress = useRef<TextInput>(null);
  const refName = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refBank = useRef<TextInput>(null);
  const refBik = useRef<TextInput>(null);
  const refIban = useRef<TextInput>(null);
  const refSwift = useRef<TextInput>(null);
  const refBankAddress = useRef<TextInput>(null);

  const [
    isMailAddressEqualToLegalAddress,
    setIsMailAddressEqualToLegalAddress,
  ] = useState(false);

  const [checkInn, checkInnMeta] = useCheckInnMutation({});
  const [postBusinessAccount, postBusinessAccountMeta] =
    usePostBusinessAccountMutation({});
  const [patchBusinessAccount, patchBusinessAccountMeta] =
    usePatchBusinessAccountMutation({});

  const validateMailAddress = (
    _mailAddress = mailAddress,
    _isMailAddressEqualToLegalAddress = isMailAddressEqualToLegalAddress,
  ) => {
    const errors = mailAddress === '' && !_isMailAddressEqualToLegalAddress;
    setErrorMailAddress(errors ? 'Укажите почтовый адрес' : '');
    return errors;
  };

  const validateEmail = (_email = email) => {
    const errors = EmailValidator.validate(_email);
    setErrorEmail(errors ? 'Проверьте правильность введенной почты' : '');
    return errors;
  };

  const validateBank = (_bank = bank) => {
    const errors = _bank === '';
    setErrorBank(errors ? 'Укажите название банка' : '');
    return errors;
  };

  const validateBik = (_bik = bik) => {
    const errors = _bik === '';
    setErrorBik(errors ? 'Укажите банковский идентификационный код' : '');
    return errors;
  };

  const validateIban = (_iban = iban) => {
    const errors = _iban === '';
    setErrorIban(errors ? 'Укажите номер расчетного счета' : '');
    return errors;
  };

  const validateSwift = (_swift = swift) => {
    const errors = _swift === '';
    setErrorSwift(errors ? 'Укажите корреспондентский счет' : '');
    return errors;
  };

  const validateName = (_name = name) => {
    const errors = _name === '';
    setErrorName(errors ? 'Укажите имя' : '');
    return errors;
  };

  const validateBankAddress = (_bankAddress = bankAddress) => {
    const errors = _bankAddress === '';
    setErrorBankAddress(errors ? 'Укажите адрес банка' : '');
    return errors;
  };

  const validatePhone = (_phone = phoneUnmasked) => {
    const errors = _phone.length !== 10;
    setErrorPhone(
      errors ? 'Проверьте правильность введенного номера телефона' : '',
    );
    return errors;
  };

  const onCheckInn = async () => {
    Keyboard.dismiss();

    try {
      await checkInn({
        data: {
          inn,
        },
      }).unwrap();
      animateLayout();
    } catch {}
  };

  const onCreateAccount = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateEmail(),
        validatePhone(),
        validateBank(),
        validateBik(),
        validateIban(),
        validateSwift(),
        validateBankAddress(),
        validateMailAddress(),
      ])
    ) {
      return true;
    }

    try {
      const payload = {
        ...CONST_PAYLOAD,
        first_name: name,
        bank_address: bankAddress,
        bank_name: bank,
        bic: bik,
        email,
        iban,
        inn,
        kpp: checkInnMeta.data?.kpp || businessAccount?.kpp,
        legal_address:
          checkInnMeta.data?.legal_address || businessAccount?.legal_address,
        legal_contact_name: name,
        legal_name:
          checkInnMeta.data?.legal_name || businessAccount?.legal_name,
        legal_receiving_docs_method: documentsDeliveryMethod,
        legal_receiving_physical_address: isMailAddressEqualToLegalAddress
          ? checkInnMeta.data?.legal_address || businessAccount?.legal_address
          : mailAddress,
        phone: `+7${phoneUnmasked}`,
        swift_code: swift,
      };

      if (isEdit) {
        await patchBusinessAccount({
          path: {
            business_account: businessAccount?.id!,
          },
          //@ts-expect-error
          data: payload,
        }).unwrap();
        ToastService.success('Аккаунт успешно изменен');
      } else {
        await postBusinessAccount({
          //@ts-expect-error
          data: payload,
        }).unwrap();
        ToastService.success('Аккаунт успешно создан');
      }

      dispatch(AppActions.setStubs({ noBusinessAccount: false }));

      !isNoBussinesAccountStub && props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorInn(errors.inn);
  }, checkInnMeta);

  useErrorHandler(errors => {
    setErrorInn(errors.inn);
    setErrorName(errors.name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
    setErrorBank(errors.bank_name);
    setErrorMailAddress(errors.legal_receiving_physical_address);
    setErrorBik(errors.bic);
    setErrorIban(errors.iban);
    setErrorSwift(errors.swift_code);
    setErrorBankAddress(errors.bank_address);
  }, postBusinessAccountMeta);

  useErrorHandler(errors => {
    setErrorInn(errors.inn);
    setErrorName(errors.name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
    setErrorBank(errors.bank_name);
    setErrorMailAddress(errors.legal_receiving_physical_address);
    setErrorBik(errors.bic);
    setErrorIban(errors.iban);
    setErrorSwift(errors.swift_code);
    setErrorBankAddress(errors.bank_address);
  }, patchBusinessAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      bank={bank}
      bankAddress={bankAddress}
      bik={bik}
      documentsDeliveryMethod={documentsDeliveryMethod}
      email={email}
      errorBank={errorBank}
      errorBankAddress={errorBankAddress}
      errorBik={errorBik}
      errorEmail={errorEmail}
      errorIban={errorIban}
      errorInn={errorInn}
      errorMailAddress={errorMailAddress}
      errorName={errorName}
      errorPhone={errorPhone}
      errorSwift={errorSwift}
      iban={iban}
      inn={inn}
      isLoading={checkInnMeta.isLoading}
      isMailAddressEqualToLegalAddress={isMailAddressEqualToLegalAddress}
      isSubmitting={
        postBusinessAccountMeta.isLoading || patchBusinessAccountMeta.isLoading
      }
      isVerified={!!checkInnMeta.data || !!isEdit}
      legalAddress={
        checkInnMeta.data?.legal_address || businessAccount?.legal_address
      }
      legalName={checkInnMeta.data?.legal_name || businessAccount?.legal_name}
      mailAddress={mailAddress}
      name={name}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      refBank={refBank}
      refBankAddress={refBankAddress}
      refBik={refBik}
      refEmail={refEmail}
      refIban={refIban}
      refMailAddress={refMailAddress}
      refName={refName}
      refPhone={refPhone}
      refSwift={refSwift}
      resetVerified={checkInnMeta.reset}
      swift={swift}
      /**
       *Methods
       */
      onCheckInn={animateDecorator(onCheckInn)}
      onCreateAccount={onCreateAccount}
      setBank={setBank}
      setBankAddress={setBankAddress}
      setBik={setBik}
      setDocumentsDeliveryMethod={setDocumentsDeliveryMethod}
      setEmail={setEmail}
      setIban={setIban}
      setInn={setInn}
      setIsMailAddressEqualToLegalAddress={setIsMailAddressEqualToLegalAddress}
      setMailAddress={setMailAddress}
      setName={setName}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
      setSwift={setSwift}
      validateBank={animateDecorator(validateBank)}
      validateBankAddress={animateDecorator(validateBankAddress)}
      validateBik={animateDecorator(validateBik)}
      validateEmail={animateDecorator(validateEmail)}
      validateIban={animateDecorator(validateIban)}
      validateMailAddress={animateDecorator(validateMailAddress)}
      validateName={animateDecorator(validateName)}
      validatePhone={animateDecorator(validatePhone)}
      validateSwift={animateDecorator(validateSwift)}
      {...props}
    />
  );
};

type PassingStates = {
  inn: string;
  name: string;
  email: string;
  phone: string;
  phoneUnmasked: string;
  bank: string;
  bik: string;
  iban: string;
  swift: string;
  mailAddress: string;
  bankAddress: string;

  documentsDeliveryMethod: DocumentsDeliveryTypes;

  isMailAddressEqualToLegalAddress: boolean;
};

type PassingProps = {
  errorName: string;
  errorEmail: string;
  errorPhone: string;
  errorBank: string;
  errorBik: string;
  errorIban: string;
  errorSwift: string;
  errorInn: string;
  errorBankAddress: string;
  errorMailAddress: string;

  legalAddress?: string;
  legalName?: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isVerified: boolean;

  refName: RefObject<TextInput>;
  refEmail: RefObject<TextInput>;
  refPhone: RefObject<TextInput>;
  refBank: RefObject<TextInput>;
  refBankAddress: RefObject<TextInput>;
  refBik: RefObject<TextInput>;
  refIban: RefObject<TextInput>;
  refSwift: RefObject<TextInput>;
  refMailAddress: RefObject<TextInput>;

  validateMailAddress: (value?: string, additionalValue?: boolean) => void;
  validateEmail: (mail?: string) => void;
  validateName: (value?: string) => void;
  validatePhone: (phone?: string) => void;
  validateBank: (value?: string) => void;
  validateBik: (value?: string) => void;
  validateIban: (value?: string) => void;
  validateSwift: (value?: string) => void;
  validateBankAddress: (value?: string) => void;
  onCheckInn: () => void;
  onCreateAccount: () => void;
  resetVerified: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
