import { useEffect, useState } from 'react';

import { useSelector } from '#hooks/redux';

import { useGetAvailableServicesQuery } from '#api/controllers/AdvertServices';
import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';

import { ImplementedAdvertisingServices } from '#config/enums';

const useAvailableAdvertServices = (
  shouldReturnServicesWithExistingAccounts = false,
) => {
  const [availableServices, setAvailableServices] = useState<
    ImplementedAdvertisingServices[]
  >([]);

  const currentBusinessAccountId = useSelector(
    state => state.app.currentBusinessAccountId,
  );

  const { data: currentBusinessAccount, isLoading } =
    useGetBusinessAccountQuery(
      {
        path: {
          business_account: currentBusinessAccountId,
        },
      },
      {
        skip: !currentBusinessAccountId,
      },
    );

  const availableServicesQuery = useGetAvailableServicesQuery(undefined, {
    skip: !currentBusinessAccountId,
  });

  const getAvailableServices = () => {
    // TODO FIX DOCS
    const allAvailableServices = (
      availableServicesQuery.data as unknown as {
        slug: ImplementedAdvertisingServices;
      }[]
    )
      ?.filter(el =>
        Object.values(ImplementedAdvertisingServices).includes(el.slug),
      )
      ?.filter(el => currentBusinessAccount?.visible_services?.[el.slug])
      .map(el => el.slug);

    if (shouldReturnServicesWithExistingAccounts) {
      return (
        allAvailableServices?.filter(
          //@ts-expect-error TODO FIX DOCS
          el => currentBusinessAccount?.existing_accounts?.[el],
        ) || []
      );
    }

    return allAvailableServices;
  };

  useEffect(() => {
    setAvailableServices(getAvailableServices());
  }, [
    availableServicesQuery.data?.length,
    currentBusinessAccount?.id,
    currentBusinessAccountId,
  ]);

  return {
    availableServices,
    loading: availableServicesQuery.isLoading || isLoading,
  };
};

export default useAvailableAdvertServices;
