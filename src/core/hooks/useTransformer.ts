import { useMemo } from 'react';

import { DTOAdvertAccount, DTOObserverClient } from '#generated/types';

const useTransformer = <T extends unknown, U extends unknown>(
  transformation: (value: T) => U,
  data?: T[],
) => {
  const memoizedValue = useMemo(
    () => (data?.length ? data.map(transformation) : undefined),
    [data],
  );

  return memoizedValue;
};

const Transformations = {
  AdvertAccount: {
    to: {
      ObserverClient: (from: DTOAdvertAccount): DTOObserverClient => ({
        id: from.id,
        name: from.description,
        account_name: from.account_name,
        account_id: from.id,
      }),
    },
  },
};

export { useTransformer, Transformations };
