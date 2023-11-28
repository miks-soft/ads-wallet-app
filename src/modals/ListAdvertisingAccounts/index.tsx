import React, { useState } from 'react';

import { useSelector } from '#hooks/redux';

import { flatten } from 'lodash';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { useGetActiveServicesAccountsQuery } from '#api/controllers/AdvertServices';

import useModal, { ModalController } from '#hooks/useModal';

import { DTOAdvertAccount } from '#generated/types';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.ListAdvertisingAccounts>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const servicesAccountsQuery = useGetActiveServicesAccountsQuery({
    params: {
      business_account_id: currentBusinessAccountId,
    },
  });

  const [selectedAccount, setSelectedAccount] = useState<
    DTOAdvertAccount | undefined
  >(undefined);

  return (
    <Layout
      /**
       *Options
       */
      accounts={
        servicesAccountsQuery.data
          ? flatten(Object.values(servicesAccountsQuery.data))
          : []
      }
      isLoading={servicesAccountsQuery.isLoading}
      modal={modal}
      selectedAccount={selectedAccount}
      /**
       *Methods
       */
      setSelectedAccount={setSelectedAccount}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  selectedAccount?: DTOAdvertAccount;
  isLoading: boolean;
  modal: ModalController;
  accounts: DTOAdvertAccount[];
  setSelectedAccount: (value: DTOAdvertAccount) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
