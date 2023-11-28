import React, { useEffect, useState } from 'react';

import { useSelector } from '#hooks/redux';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';
import useAvailableAdvertServices from '#api/hooks/useAvailableAdvertServices';

import { ImplementedAdvertisingServices } from '#config/enums';

import { DTOBusinessAccount } from '#generated/types';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.CashbackAndCommission>;

const Container: React.FC<NavigationProps> = props => {
  const { availableServices, loading } = useAvailableAdvertServices(true);

  const [selectedService, setSelectedService] = useState(availableServices[0]);

  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const businessAccountQuery = useGetBusinessAccountQuery({
    path: {
      business_account: currentBusinessAccountId,
    },
  });

  useEffect(() => {
    setSelectedService(availableServices[0]);
  }, [availableServices]);

  return (
    <Layout
      /**
       *Options
       */
      availableServices={availableServices}
      businessAccount={businessAccountQuery.data}
      isLoading={loading}
      selectedService={selectedService}
      /**
       *Methods
       */
      setSelectedService={setSelectedService}
      {...props}
    />
  );
};

type PassingStates = {
  selectedService: ImplementedAdvertisingServices;
};

type PassingProps = {
  isLoading: boolean;
  availableServices: ImplementedAdvertisingServices[];
  businessAccount?: DTOBusinessAccount;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
