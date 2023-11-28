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

import { ReceiptDeliveryTypes } from '#config/enums';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { isHaveErrors } from '#utils';

import { AppActions } from '#store/slices/app';

import { CONST_PAYLOAD } from './config';
import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  BusinessAccountScreenProps<BusinessAccountRoutes.CU>,
  AppScreenProps<AppRoutes>
> & { tab: number; setTab: SetState<number> };

const Container: React.FC<NavigationProps> = props => {
  const { isEdit, businessAccount } = props.route.params;
  const dispatch = useDispatch();

  const isNoBussinesAccountStub = useSelector(
    store => store.app.stubs.noBusinessAccount,
  );

  const [name, setName, errorName, setErrorName] = useField(
    isEdit ? businessAccount?.first_name! : '',
  );
  const [email, setEmail, errorEmail, setErrorEmail] = useField(
    isEdit ? businessAccount?.email! : '',
  );
  const [phone, setPhone, errorPhone, setErrorPhone] = useField(
    isEdit ? businessAccount?.phone! : '',
  );
  const [surname, setSurname, errorSurname, setErrorSurname] = useField(
    isEdit ? businessAccount?.last_name! : '',
  );
  const [patronymic, setPatronymic, errorPatronymic, setErrorPatronymic] =
    useField(isEdit ? businessAccount?.patronymic! : '');
  const [phoneUnmasked, setPhoneUnmasked] = useState(
    isEdit
      ? businessAccount?.phone
          ?.slice(2)
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')!
      : '',
  );

  const refName = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refSurname = useRef<TextInput>(null);
  const refPatronymic = useRef<TextInput>(null);

  const [receiptDeliveryMethod, setReceiptDeliveryMethod] = useState(
    isEdit
      ? (businessAccount?.receiving_checks_method as ReceiptDeliveryTypes)
      : ReceiptDeliveryTypes.EMAIL,
  );

  const [postBusinessAccount, postBusinessAccountMeta] =
    usePostBusinessAccountMutation({});
  const [patchBusinessAccount, patchBusinessAccountMeta] =
    usePatchBusinessAccountMutation({});

  const validateEmail = (_email = email) => {
    const errors = EmailValidator.validate(_email);
    setErrorEmail(errors ? 'Проверьте правильность введенной почты' : '');
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

    if (isHaveErrors([validateEmail(), validatePhone()])) {
      return true;
    }

    try {
      const payload = {
        ...CONST_PAYLOAD,
        first_name: name,
        last_name: surname,
        patronymic: patronymic,
        email,
        phone: `+7${phoneUnmasked}`,
        receiving_checks_method: receiptDeliveryMethod,
        bic: patronymic,
      };

      if (isEdit) {
        await patchBusinessAccount({
          path: {
            business_account: businessAccount?.id!,
          },
          data: payload,
        }).unwrap();
        ToastService.success('Аккаунт успешно изменен');
      } else {
        await postBusinessAccount({
          data: payload,
        }).unwrap();
        ToastService.success('Аккаунт успешно создан');
      }

      dispatch(AppActions.setStubs({ noBusinessAccount: false }));

      !isNoBussinesAccountStub && props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorName(errors.first_name);
    setErrorSurname(errors.last_name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
    setErrorPatronymic(errors.patronymic);
  }, postBusinessAccountMeta);

  useErrorHandler(errors => {
    setErrorName(errors.first_name);
    setErrorSurname(errors.last_name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
    setErrorPatronymic(errors.patronymic);
  }, patchBusinessAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      email={email}
      errorEmail={errorEmail}
      errorName={errorName}
      errorPatronymic={errorPatronymic}
      errorPhone={errorPhone}
      errorSurname={errorSurname}
      isSubmitting={
        postBusinessAccountMeta.isLoading || patchBusinessAccountMeta.isLoading
      }
      name={name}
      patronymic={patronymic}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      receiptDeliveryMethod={receiptDeliveryMethod}
      refEmail={refEmail}
      refName={refName}
      refPatronymic={refPatronymic}
      refPhone={refPhone}
      refSurname={refSurname}
      surname={surname}
      /**
       *Methods
       */
      onCreateAccount={onCreateAccount}
      setEmail={setEmail}
      setName={setName}
      setPatronymic={setPatronymic}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
      setReceiptDeliveryMethod={setReceiptDeliveryMethod}
      setSurname={setSurname}
      validateEmail={validateEmail}
      validatePhone={validatePhone}
      {...props}
    />
  );
};

type PassingStates = {
  name: string;
  email: string;
  phone: string;
  phoneUnmasked: string;
  surname: string;
  patronymic: string;
  receiptDeliveryMethod: ReceiptDeliveryTypes;
};

type PassingProps = {
  errorName: string;
  errorEmail: string;
  errorPhone: string;
  errorSurname: string;
  errorPatronymic: string;

  isSubmitting: boolean;

  refName: RefObject<TextInput>;
  refEmail: RefObject<TextInput>;
  refPhone: RefObject<TextInput>;
  refSurname: RefObject<TextInput>;
  refPatronymic: RefObject<TextInput>;

  validateEmail: (mail?: string) => void;
  validatePhone: (phone?: string) => void;
  onCreateAccount: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
