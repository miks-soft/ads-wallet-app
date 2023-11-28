import React from 'react';
import { Keyboard } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  RestorePasswordRoutes,
  RestorePasswordScreenProps,
} from '#navigation/RestorePassword/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useCheckResetPasswordCodeMutation } from '#api/controllers/Auth';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  RestorePasswordScreenProps<RestorePasswordRoutes.Code>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const [code, setCode, errorCode, setErrorCode] = useField('');

  const [checkResetPassword, checkResetPasswordMeta] =
    useCheckResetPasswordCodeMutation();

  const onVerifyCode = async () => {
    Keyboard.dismiss();

    try {
      await checkResetPassword({
        data: {
          password_reset_code: code,
          email: props.route.params.email,
        },
      }).unwrap();

      props.navigation.navigate(RestorePasswordRoutes.Main, {
        email: props.route.params.email,
        code: code,
      });
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorCode(errors.password_reset_code);
  }, checkResetPasswordMeta);

  return (
    <Layout
      /**
       *Options
       */
      code={code}
      errorCode={errorCode}
      isLoading={checkResetPasswordMeta.isLoading}
      /**
       *Methods
       */
      onVerifyCode={onVerifyCode}
      setCode={setCode}
      {...props}
    />
  );
};

type PassingStates = {
  code: string;
};

type PassingProps = {
  errorCode: string;
  isLoading: boolean;
  onVerifyCode: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
