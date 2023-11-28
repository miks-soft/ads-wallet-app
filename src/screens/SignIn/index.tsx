import React, { RefObject, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import { AuthRoutes, AuthScreenProps } from '#navigation/Auth/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import useLogin from '#api/hooks/useLogin';

import { PasswordValidationSchema } from '#services/validators/PasswordValidator';

import useField from '#hooks/useField';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  AuthScreenProps<AuthRoutes.SignIn>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const [mail, setMail, errorMail, setErrorMail] = useField('');
  const [password, setPassword, errorPassword, setErrorPassword] = useField('');

  const refMailInput = useRef<TextInput>(null);
  const refPasswordInput = useRef<TextInput>(null);

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);

  const { login, loading } = useLogin(setErrorMail, setErrorPassword);

  const [errorPasswords, setErrorPasswords] = useState<
    PasswordValidationSchema | undefined
  >(undefined);

  const onSignIn = async () => {
    Keyboard.dismiss();

    try {
      login(mail, password);
    } catch (e) {}
  };

  return (
    <Layout
      /**
       *Options
       */
      errorMail={errorMail}
      errorPassword={errorPassword}
      errorPasswords={errorPasswords}
      isLoading={loading}
      isPasswordMasked={isPasswordMasked}
      mail={mail}
      password={password}
      refMailInput={refMailInput}
      refPasswordInput={refPasswordInput}
      onSignIn={onSignIn}
      /**
       *Methods
       */
      setErrorPasswords={setErrorPasswords}
      setIsPasswordMasked={setIsPasswordMasked}
      setMail={setMail}
      setPassword={setPassword}
      {...props}
    />
  );
};

type PassingStates = {
  isPasswordMasked: boolean;
  mail: string;
  password: string;
};

type PassingProps = {
  errorMail: string;
  errorPassword: string;
  isLoading: boolean;
  refMailInput: RefObject<TextInput>;
  refPasswordInput: RefObject<TextInput>;
  errorPasswords?: PasswordValidationSchema;
  onSignIn: () => void;
  setErrorPasswords: (value?: PasswordValidationSchema) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
