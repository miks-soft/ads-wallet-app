import React, { RefObject, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import { AuthRoutes, AuthScreenProps } from '#navigation/Auth/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useRegisterMutation } from '#api/controllers/Registration';
import useLogin from '#api/hooks/useLogin';

import EmailValidator from '#services/validators/EmailValidator';
import PasswordValidator, {
  PasswordValidationSchema,
} from '#services/validators/PasswordValidator';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { animateDecorator, delay, isHaveErrors } from '#utils';

import Layout from './layout';
import { AccountTypes } from './types';

type NavigationProps = CompositeScreenProps<
  AuthScreenProps<AuthRoutes.SignUp>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const [mail, setMail, errorMail, setErrorMail] = useField('');
  const [phone, setPhone, errorPhone, setErrorPhone] = useField('');
  const [phoneUnmasked, setPhoneUnmasked] = useField('');
  const [accountType, setAccountType, errorAccountType, setErrorAccountType] =
    useField<AccountTypes | undefined>(undefined);
  const [password, setPassword, errorPassword, setErrorPassword] = useField('');
  const [
    repeatedPassword,
    setRepeatedPassword,
    errorRepeatedPassword,
    setErrorRepeatedPassword,
  ] = useField('');

  const refMailInput = useRef<TextInput>(null);
  const refPhoneInput = useRef<TextInput>(null);
  const refPasswordInput = useRef<TextInput>(null);
  const refRepeatedPasswordInput = useRef<TextInput>(null);

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isRepeatedPasswordMasked, setIsRepeatedPasswordMasked] =
    useState(true);

  const [errorPasswords, setErrorPasswords] = useState<
    PasswordValidationSchema | undefined
  >(undefined);

  const [register, registerMeta] = useRegisterMutation();
  const { login, loading } = useLogin();

  const validatePassword = (_password = password) => {
    const errors = PasswordValidator.validateAll(_password);
    setErrorPasswords(errors);
    return errors;
  };

  const validateRepeatedPassword = (
    _password = password,
    _repeatedPassword = repeatedPassword,
  ) => {
    const errors = _password !== _repeatedPassword;
    setErrorRepeatedPassword(
      errors ? STRINGS.SCREEN_SIGN_UP.repeatedPasswordVerifiactionError : '',
    );
    return errors;
  };

  const validateMail = (_mail = mail) => {
    const errors = EmailValidator.validate(_mail);
    setErrorMail(errors ? STRINGS.SCREEN_SIGN_UP.emailVerificationError : '');
    return errors;
  };

  const validatePhone = (_phone = phoneUnmasked) => {
    const errors = _phone.length !== 10;
    setErrorPhone(errors ? STRINGS.SCREEN_SIGN_UP.phoneVerificationError : '');
    return errors;
  };

  const validateAccountType = (_accountType = accountType) => {
    const errors = !accountType;
    setErrorAccountType(
      errors ? STRINGS.SCREEN_SIGN_UP.accountTypeVerificationError : '',
    );
    return errors;
  };

  const onSignUp = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateMail(),
        validatePhone(),
        validateRepeatedPassword(),
        validateAccountType(),
        !!Object.values(validatePassword()).filter(el => !el).length,
      ])
    ) {
      return;
    }

    try {
      await register({
        data: {
          email: mail,
          phone: `+7${phoneUnmasked}`,
          password: password,
          password_confirmation: repeatedPassword,
          privacy_policy_accepted: true,
          user_agreement_accepted: true,
          type: accountType!,
        },
      }).unwrap();

      await delay(500);

      await login(mail, password);
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorAccountType(errors.type);
    setErrorMail(errors.email);
    setErrorPhone(errors.phone);
    setErrorPassword(errors.password);
    setErrorRepeatedPassword(errors.password_confirmation);
  }, registerMeta);

  return (
    <Layout
      /**
       *Options
       */
      accountType={accountType}
      errorAccountType={errorAccountType}
      errorMail={errorMail}
      errorPassword={errorPassword}
      errorPasswords={errorPasswords}
      errorPhone={errorPhone}
      errorRepeatedPassword={errorRepeatedPassword}
      isLoading={registerMeta.isLoading || loading}
      isPasswordMasked={isPasswordMasked}
      isRepeatedPasswordMasked={isRepeatedPasswordMasked}
      mail={mail}
      password={password}
      phone={phone}
      phoneUnmasked={phoneUnmasked}
      refMailInput={refMailInput}
      refPasswordInput={refPasswordInput}
      refPhoneInput={refPhoneInput}
      refRepeatedPasswordInput={refRepeatedPasswordInput}
      repeatedPassword={repeatedPassword}
      onSignUp={onSignUp}
      /**
       *Methods
       */
      setAccountType={setAccountType}
      setErrorPasswords={setErrorPasswords}
      setIsPasswordMasked={setIsPasswordMasked}
      setIsRepeatedPasswordMasked={setIsRepeatedPasswordMasked}
      setMail={setMail}
      setPassword={setPassword}
      setPhone={setPhone}
      setPhoneUnmasked={setPhoneUnmasked}
      setRepeatedPassword={setRepeatedPassword}
      validateMail={animateDecorator(validateMail)}
      validatePassword={animateDecorator(validatePassword)}
      validatePhone={animateDecorator(validatePhone)}
      validateRepeatedPassword={animateDecorator(validateRepeatedPassword)}
      {...props}
    />
  );
};

type PassingStates = {
  accountType?: AccountTypes;
  isPasswordMasked: boolean;
  isRepeatedPasswordMasked: boolean;
  mail: string;
  password: string;
  repeatedPassword: string;
  phone: string;
  phoneUnmasked: string;
};

type PassingProps = {
  errorAccountType: string;
  errorMail: string;
  errorPhone: string;
  errorPassword: string;
  errorRepeatedPassword: string;
  isLoading: boolean;
  refMailInput: RefObject<TextInput>;
  refPhoneInput: RefObject<TextInput>;
  refPasswordInput: RefObject<TextInput>;
  refRepeatedPasswordInput: RefObject<TextInput>;
  onSignUp: () => void;
  validateMail: (mail?: string) => void;
  validatePhone: (phone?: string) => void;
  validatePassword: (password?: string) => void;
  validateRepeatedPassword: (
    password?: string,
    repeatedPassword?: string,
  ) => void;
  errorPasswords?: PasswordValidationSchema;
  setErrorPasswords: (value?: PasswordValidationSchema) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
