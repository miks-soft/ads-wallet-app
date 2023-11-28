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
        email,
        phone: `+7${phoneUnmasked}`,
      };

      if (isEdit) {
        await patchBusinessAccount({
          path: {
            business_account: businessAccount?.id!,
          },
          //@ts-expect-error
          data: payload,
        }).unwrap();
        ToastService.success('Account has been successfully edited');
      } else {
        await postBusinessAccount({
          //@ts-expect-error
          data: payload,
        }).unwrap();
        ToastService.success('Account has been successfully created');
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
  }, postBusinessAccountMeta);

  useErrorHandler(errors => {
    setErrorName(errors.first_name);
    setErrorSurname(errors.last_name);
    setErrorEmail(errors.email);
    setErrorPhone(errors.phone);
  }, patchBusinessAccountMeta);

  return (
    <Layout
      /**
       *Options
       */
      email={email}
      errorEmail={errorEmail}
      errorName={errorName}
      errorPhone={errorPhone}
      errorSurname={errorSurname}
      isSubmitting={
        postBusinessAccountMeta.isLoading || patchBusinessAccountMeta.isLoading
      }
      name={name}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      refEmail={refEmail}
      refName={refName}
      refPhone={refPhone}
      refSurname={refSurname}
      surname={surname}
      /**
       *Methods
       */
      onCreateAccount={onCreateAccount}
      setEmail={setEmail}
      setName={setName}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
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
};

type PassingProps = {
  errorName: string;
  errorEmail: string;
  errorPhone: string;
  errorSurname: string;

  isSubmitting: boolean;

  refName: RefObject<TextInput>;
  refEmail: RefObject<TextInput>;
  refPhone: RefObject<TextInput>;
  refSurname: RefObject<TextInput>;

  validateEmail: (mail?: string) => void;
  validatePhone: (phone?: string) => void;
  onCreateAccount: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
