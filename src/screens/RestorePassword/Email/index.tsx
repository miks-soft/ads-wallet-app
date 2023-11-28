import React from 'react';
import { Keyboard } from 'react-native';

import { CompositeScreenProps } from '@react-navigation/native';

import { useTimer } from '#components/providers/OTPTimerProvider';

import {
  RestorePasswordRoutes,
  RestorePasswordScreenProps,
} from '#navigation/RestorePassword/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { STRINGS } from '#localization';

import { useSendResetPasswordCodeMutation } from '#api/controllers/Auth';

import EmailValidator from '#services/validators/EmailValidator';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';

import { animateDecorator, isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  RestorePasswordScreenProps<RestorePasswordRoutes.Email>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const timer = useTimer();
  const [mail, setMail, errorMail, setErrorMail] = useField('');

  const [sendResetPassword, sendResetPasswordMeta] =
    useSendResetPasswordCodeMutation();

  const validateMail = (_mail = mail) => {
    const errors = EmailValidator.validate(_mail);
    setErrorMail(
      errors
        ? STRINGS.SCREEN_RESTORE_PASSWORD_EMAIL.emailVerificationError
        : '',
    );
    return errors;
  };

  const onSendEmail = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateMail()])) {
      return;
    }

    try {
      await sendResetPassword({
        data: {
          email: mail,
        },
      }).unwrap();

      timer.ref.current?.start();

      props.navigation.navigate(RestorePasswordRoutes.Code, { email: mail });
    } catch {}
  };

  useErrorHandler(errors => {
    setErrorMail(errors.email);
  }, sendResetPasswordMeta);

  return (
    <Layout
      /**
       *Options
       */
      errorMail={errorMail}
      isLoading={sendResetPasswordMeta.isLoading}
      mail={mail}
      /**
       *Methods
       */
      onSendEmail={onSendEmail}
      setMail={setMail}
      validateMail={animateDecorator(validateMail)}
      {...props}
    />
  );
};

type PassingStates = {
  mail: string;
};

type PassingProps = {
  errorMail: string;
  isLoading: boolean;
  onSendEmail: () => void;
  validateMail: (mail?: string) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
