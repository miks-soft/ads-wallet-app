import { useState } from 'react';

import { useDispatch } from '#hooks/redux';

import * as Keychain from 'react-native-keychain';

import { Query } from '#api';
import {
  useLazyGetUserInfoQuery,
  useLoginMutation,
} from '#api/controllers/Auth';
import { useLazyGetBusinessAccountsQuery } from '#api/controllers/BusinessAccounts';

import useErrorHandler from '#hooks/useErrorHandler';

import { delay } from '#utils';

import { AppActions } from '#store/slices/app';

const useLogin = (
  setErrorMail?: SetState<string>,
  setErrorPassword?: SetState<string>,
) => {
  const dispatch = useDispatch();

  const [login, loginMeta] = useLoginMutation();
  const [businessAccountQueryTrigger] = useLazyGetBusinessAccountsQuery({});
  const [userInfoQueryTrigger] = useLazyGetUserInfoQuery({});
  const [loading, setLoading] = useState(false);

  const onSignIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const loginResult = await login({
        data: {
          email,
          password,
        },
      }).unwrap();

      await Keychain.setGenericPassword(email, loginResult?.token!);

      dispatch(Query.util.resetApiState());

      await delay(500);

      const result = await userInfoQueryTrigger();

      if (result.data?.is_verified) {
        //@ts-expect-error TODO FIX DOCS
        await businessAccountQueryTrigger({
          params: {
            per_page: 20,
            page: 1,
          },
        });
      }

      dispatch(AppActions.setSignedIn(true));
    } catch (e) {}
    setLoading(false);
  };

  useErrorHandler(errors => {
    setErrorMail && setErrorMail(errors.email);
    setErrorPassword && setErrorPassword(errors.password);
  }, loginMeta);

  return {
    login: onSignIn,
    loading: loading,
  };
};

export default useLogin;
