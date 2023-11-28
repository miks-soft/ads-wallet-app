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
  usePatchBusinessAccountMutation,
  usePostBusinessAccountMutation,
} from '#api/controllers/BusinessAccounts';

import ToastService from '#services/ToastService';
import EmailValidator from '#services/validators/EmailValidator';

import { DocumentsDeliveryTypes } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { animateDecorator, isHaveErrors } from '#utils';

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
  const [legalName, setLegalName, errorLegalName, setErrorLegalName] = useField(
    isEdit ? businessAccount?.legal_name || '' : '',
  );
  const [
    legalAddress,
    setLegalAddress,
    errorLegalAddress,
    setErrorLegalAddress,
  ] = useField(isEdit ? businessAccount?.legal_address || '' : '');
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

  const [
    representativeName,
    setRepresentativeName,
    errorRepresentativeName,
    setErrorRepresentativeName,
    //@ts-expect-error
  ] = useField(isEdit ? businessAccount?.contract_signature_firstname! : '');
  const [
    representativeLastName,
    setRepresentativeLastName,
    errorRepresentativeLastName,
    setErrorRepresentativeLastName,
    //@ts-expect-error
  ] = useField(isEdit ? businessAccount?.contract_signature_lastname! : '');
  const [
    representativePosition,
    setRepresentativePosition,
    errorRepresentativePosition,
    setErrorRepresentativePosition,
    //@ts-expect-error
  ] = useField(isEdit ? businessAccount?.contract_signature_position! : '');
  const [
    representativeBasedPosition,
    setRepresentativeBasedPosition,
    errorRepresentativeBasedPosition,
    setErrorRepresentativeBasedPosition,
    //@ts-expect-error
  ] = useField(isEdit ? businessAccount?.contract_signature_document! : '');

  const refLegalName = useRef<TextInput>(null);
  const refLegalAddress = useRef<TextInput>(null);

  const refName = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refBank = useRef<TextInput>(null);
  const refBik = useRef<TextInput>(null);
  const refIban = useRef<TextInput>(null);
  const refSwift = useRef<TextInput>(null);
  const refBankAddress = useRef<TextInput>(null);
  const refRepresentativeName = useRef<TextInput>(null);
  const refRepresentativeLastName = useRef<TextInput>(null);
  const refRepresentativePosition = useRef<TextInput>(null);
  const refRepresentativeBasedPosition = useRef<TextInput>(null);

  const [
    isMailAddressEqualToLegalAddress,
    setIsMailAddressEqualToLegalAddress,
  ] = useState(false);

  const [postBusinessAccount, postBusinessAccountMeta] =
    usePostBusinessAccountMutation({});
  const [patchBusinessAccount, patchBusinessAccountMeta] =
    usePatchBusinessAccountMutation({});

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
        legal_address: legalAddress,
        legal_contact_name: name,
        legal_name: legalName,
        legal_receiving_docs_method: documentsDeliveryMethod,
        phone: `+7${phoneUnmasked}`,
        contract_signature_firstname: representativeName,
        contract_signature_lastname: representativeLastName,
        contract_signature_position: representativePosition,
        contract_signature_document: representativeBasedPosition,
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

  const handleBEError = (errors: { [key in string]: string }) => {
    setErrorLegalName(errors.legal_name);
    setErrorLegalAddress(errors.legal_address);
    setErrorInn(errors.inn);
    setErrorName(errors.name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
    setErrorBank(errors.bank_name);
    setErrorBik(errors.bic);
    setErrorIban(errors.iban);
    setErrorSwift(errors.swift_code);
    setErrorBankAddress(errors.bank_address);
    setErrorRepresentativeName(errors.contract_signature_firstname);
    setErrorRepresentativeLastName(errors.contract_signature_lastname);
    setErrorRepresentativePosition(errors.contract_signature_position);
    setErrorRepresentativeBasedPosition(errors.contract_signature_document);
  };

  useErrorHandler(handleBEError, postBusinessAccountMeta);
  useErrorHandler(handleBEError, patchBusinessAccountMeta);

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
      errorLegalAddress={errorLegalAddress}
      errorLegalName={errorLegalName}
      errorName={errorName}
      errorPhone={errorPhone}
      errorRepresentativeBasedPosition={errorRepresentativeBasedPosition}
      errorRepresentativeLastName={errorRepresentativeLastName}
      errorRepresentativeName={errorRepresentativeName}
      errorRepresentativePosition={errorRepresentativePosition}
      errorSwift={errorSwift}
      iban={iban}
      inn={inn}
      isMailAddressEqualToLegalAddress={isMailAddressEqualToLegalAddress}
      isSubmitting={
        postBusinessAccountMeta.isLoading || patchBusinessAccountMeta.isLoading
      }
      legalAddress={legalAddress}
      legalName={legalName}
      name={name}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      refBank={refBank}
      refBankAddress={refBankAddress}
      refBik={refBik}
      refEmail={refEmail}
      refIban={refIban}
      refLegalAddress={refLegalAddress}
      refLegalName={refLegalName}
      refName={refName}
      refPhone={refPhone}
      refRepresentativeBasedPosition={refRepresentativeBasedPosition}
      refRepresentativeLastName={refRepresentativeLastName}
      refRepresentativeName={refRepresentativeName}
      refRepresentativePosition={refRepresentativePosition}
      refSwift={refSwift}
      representativeBasedPosition={representativeBasedPosition}
      representativeLastName={representativeLastName}
      representativeName={representativeName}
      representativePosition={representativePosition}
      swift={swift}
      /**
       *Methods
       */
      onCreateAccount={onCreateAccount}
      setBank={setBank}
      setBankAddress={setBankAddress}
      setBik={setBik}
      setDocumentsDeliveryMethod={setDocumentsDeliveryMethod}
      setEmail={setEmail}
      setIban={setIban}
      setInn={setInn}
      setIsMailAddressEqualToLegalAddress={setIsMailAddressEqualToLegalAddress}
      setLegalAddress={setLegalAddress}
      setLegalName={setLegalName}
      setName={setName}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
      setRepresentativeBasedPosition={setRepresentativeBasedPosition}
      setRepresentativeLastName={setRepresentativeLastName}
      setRepresentativeName={setRepresentativeName}
      setRepresentativePosition={setRepresentativePosition}
      setSwift={setSwift}
      validateBank={animateDecorator(validateBank)}
      validateBankAddress={animateDecorator(validateBankAddress)}
      validateBik={animateDecorator(validateBik)}
      validateEmail={animateDecorator(validateEmail)}
      validateIban={animateDecorator(validateIban)}
      validateName={animateDecorator(validateName)}
      validatePhone={animateDecorator(validatePhone)}
      validateSwift={animateDecorator(validateSwift)}
      {...props}
    />
  );
};

type PassingStates = {
  inn: string;
  legalName: string;
  legalAddress: string;

  representativeName: string;
  representativeLastName: string;
  representativePosition: string;
  representativeBasedPosition: string;

  name: string;
  email: string;
  phone: string;
  phoneUnmasked: string;

  bank: string;
  bik: string;
  iban: string;
  swift: string;
  bankAddress: string;

  documentsDeliveryMethod: DocumentsDeliveryTypes;

  isMailAddressEqualToLegalAddress: boolean;
};

type PassingProps = {
  errorInn: string;
  errorLegalName: string;
  errorLegalAddress: string;

  errorRepresentativeName: string;
  errorRepresentativeLastName: string;
  errorRepresentativePosition: string;
  errorRepresentativeBasedPosition: string;

  errorName: string;
  errorEmail: string;
  errorPhone: string;

  errorBank: string;
  errorBik: string;
  errorIban: string;
  errorSwift: string;
  errorBankAddress: string;

  isSubmitting: boolean;

  refLegalName: RefObject<TextInput>;
  refLegalAddress: RefObject<TextInput>;

  refRepresentativeName: RefObject<TextInput>;
  refRepresentativeLastName: RefObject<TextInput>;
  refRepresentativePosition: RefObject<TextInput>;
  refRepresentativeBasedPosition: RefObject<TextInput>;

  refName: RefObject<TextInput>;
  refEmail: RefObject<TextInput>;
  refPhone: RefObject<TextInput>;

  refBank: RefObject<TextInput>;
  refBik: RefObject<TextInput>;
  refIban: RefObject<TextInput>;
  refSwift: RefObject<TextInput>;
  refBankAddress: RefObject<TextInput>;

  validateEmail: (mail?: string) => void;
  validateName: (value?: string) => void;
  validatePhone: (phone?: string) => void;
  validateBank: (value?: string) => void;
  validateBik: (value?: string) => void;
  validateIban: (value?: string) => void;
  validateSwift: (value?: string) => void;
  validateBankAddress: (value?: string) => void;
  onCreateAccount: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
