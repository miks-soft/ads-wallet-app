import React, { RefObject, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  RestorePasswordRoutes,
  RestorePasswordScreenProps,
} from '#navigation/RestorePassword/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useResetPasswordMutation } from '#api/controllers/Auth';

import PasswordValidator, {
  PasswordValidationSchema,
} from '#services/validators/PasswordValidator';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { animateDecorator, isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  RestorePasswordScreenProps<RestorePasswordRoutes.Main>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const [password, setPassword, errorPassword, setErrorPassword] = useField('');
  const [
    repeatedPassword,
    setRepeatedPassword,
    errorRepeatedPassword,
    setErrorRepeatedPassword,
  ] = useField('');

  const refRepeatedPasswordInput = useRef<TextInput>(null);
  const refPasswordInput = useRef<TextInput>(null);

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isRepeatedPasswordMasked, setIsRepeatedPasswordMasked] =
    useState(true);

  const [errorPasswords, setErrorPasswords] = useState<
    PasswordValidationSchema | undefined
  >(undefined);

  const [resetPassword, resetPasswordMeta] = useResetPasswordMutation();

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
      errors
        ? STRINGS.SCREEN_RESTORE_PASSWORD_MAIN.repeatedPasswordVerifiactionError
        : '',
    );
    return errors;
  };

  const onRestorePassword = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateRepeatedPassword(),
        !!Object.values(validatePassword()).filter(el => !el).length,
      ])
    ) {
      return;
    }

    resetPassword({
      data: {
        email: props.route.params.email,
        password,
        password_confirmation: repeatedPassword,
        password_reset_code: props.route.params.code,
      },
    });
  };

  useErrorHandler(errors => {
    setErrorRepeatedPassword(errors.password_confirmation);
    setErrorPassword(errors.password);
  }, resetPasswordMeta);

  return (
    <Layout
      /**
       *Options
       */
      errorPassword={errorPassword}
      errorPasswords={errorPasswords}
      errorRepeatedPassword={errorRepeatedPassword}
      isLoading={resetPasswordMeta.isLoading}
      isPasswordMasked={isPasswordMasked}
      isRepeatedPasswordMasked={isRepeatedPasswordMasked}
      password={password}
      refPasswordInput={refPasswordInput}
      refRepeatedPasswordInput={refRepeatedPasswordInput}
      repeatedPassword={repeatedPassword}
      /**
       *Methods
       */
      onRestorePassword={onRestorePassword}
      setErrorPasswords={setErrorPasswords}
      setIsPasswordMasked={setIsPasswordMasked}
      setIsRepeatedPasswordMasked={setIsRepeatedPasswordMasked}
      setPassword={setPassword}
      setRepeatedPassword={setRepeatedPassword}
      validatePassword={animateDecorator(validatePassword)}
      validateRepeatedPassword={animateDecorator(validateRepeatedPassword)}
      {...props}
    />
  );
};

type PassingStates = {
  isPasswordMasked: boolean;
  password: string;
  repeatedPassword: string;
  isRepeatedPasswordMasked: boolean;
};

type PassingProps = {
  errorPassword: string;
  errorRepeatedPassword: string;
  isLoading: boolean;
  refPasswordInput: RefObject<TextInput>;
  refRepeatedPasswordInput: RefObject<TextInput>;
  errorPasswords?: PasswordValidationSchema;
  onRestorePassword: () => void;
  validatePassword: (password?: string) => void;
  validateRepeatedPassword: (
    password?: string,
    repeatedPassword?: string,
  ) => void;
  setErrorPasswords: (value?: PasswordValidationSchema) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
